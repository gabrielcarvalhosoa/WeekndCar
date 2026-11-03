// Utilitários de DOM compartilhados pelos componentes
export const esc = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Imagem do carro: se a foto não existir, troca por uma ilustração retrô gerada no navegador
export function criarImagem(carro, raiz, placeholder, alt = "") {
  const img = document.createElement("img");
  img.alt = alt;
  img.loading = "lazy";
  img.src = `${raiz}${carro.foto}`;
  img.addEventListener("error", () => {
    img.dataset.semFoto = "1";
    img.src = placeholder(carro);
  }, { once: true });
  return img;
}

// Aviso em uma caixa de alerta do Bootstrap (cada linha é um texto simples, sem HTML)
export function mostrarAviso(caixa, texto, tipo = "danger") {
  caixa.className = `alert alert-${tipo}`;
  caixa.replaceChildren(...[].concat(texto).map((t) => Object.assign(document.createElement("div"), { textContent: t })));
  caixa.scrollIntoView?.({ block: "nearest" });
}

export function mensagemDeErro(err) {
  if (err instanceof TypeError) return "Não foi possível conectar à API. Verifique se o comando npm run api está rodando.";
  return /Erro 404/.test(err.message) ? "Não encontramos o que você procurou." : err.message;
}
