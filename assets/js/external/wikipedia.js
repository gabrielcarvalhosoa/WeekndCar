// Resumo do modelo na Wikipedia (texto em inglês). Em qualquer falha devolve null.
const BASE = "https://en.wikipedia.org";

async function resumoPorTitulo(titulo) {
  const r = await fetch(`${BASE}/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`);
  if (!r.ok) return null;
  const d = await r.json();
  if (d.type === "disambiguation" || !d.extract) return null;
  return { texto: d.extract, imagem: d.thumbnail?.source ?? null, url: d.content_urls?.desktop?.page ?? null };
}

export async function resumoDoCarro(carro) {
  try {
    let resumo = carro.wikipedia ? await resumoPorTitulo(carro.wikipedia) : null;
    if (!resumo) {
      // plano B: busca pelo nome do carro
      const busca = await fetch(`${BASE}/w/rest.php/v1/search/title?q=${encodeURIComponent(`${carro.marca} ${carro.modelo}`)}&limit=1`);
      const pagina = busca.ok ? (await busca.json()).pages?.[0] : null;
      if (pagina) resumo = await resumoPorTitulo(pagina.key);
    }
    return resumo;
  } catch {
    return null;
  }
}
