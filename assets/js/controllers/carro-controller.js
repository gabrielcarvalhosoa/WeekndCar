// Página de detalhes do carro
import { sessao } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";
import { esc, criarImagem } from "../components/dom.js";
import { CATEGORIAS, formatarMoeda, imagemPlaceholder } from "../models/carro.js";
import { buscarPorId, nomeDoProprietario } from "../services/carro-service.js";
import { resumoDoCarro } from "../external/wikipedia.js";

const $ = (id) => document.getElementById(id);
renderNavbar($("navbar"), true);

const id = new URLSearchParams(location.search).get("id");
const alvo = $("detalhe");
const erro = (texto) => (alvo.innerHTML = `<div class="alert alert-danger" role="alert">${esc(texto)} <a href="../index.html">Voltar ao catálogo</a></div>`);

function botaoReserva() {
  const s = sessao();
  if (!s) return `<a class="btn btn-wc" href="login.html">Entre para reservar</a>`;
  if (s.tipo === "cliente") return `<button class="btn btn-wc" type="button" disabled>Reservar este carro (em breve)</button>`;
  return "";
}

try {
  const c = await buscarPorId(id);
  const dono = await nomeDoProprietario(c);
  document.title = `${c.marca} ${c.modelo} | WeekndCar`;
  alvo.innerHTML = `
    <a href="../index.html">Voltar ao catálogo</a>
    <div class="row g-4 mt-1">
      <div class="col-lg-7"><div class="foto-detalhe" id="foto"></div></div>
      <div class="col-lg-5">
        <h1 class="mb-1">${esc(c.marca)} ${esc(c.modelo)}</h1>
        <p class="etiqueta-preco d-inline-block">${formatarMoeda(c.diaria)} por dia</p>
        <p class="mt-2">Fim de semana (2 diárias): <strong>${formatarMoeda(c.diaria * 2)}</strong></p>
        <p>${esc(c.descricao)}</p>
        <dl class="ficha-tecnica">
          <dt>Ano</dt><dd>${esc(c.ano)}</dd>
          <dt>Categoria</dt><dd>${esc(CATEGORIAS[c.categoria] ?? c.categoria)}</dd>
          <dt>Matrícula</dt><dd>${esc(c.matricula)}</dd>
          <dt>Placa</dt><dd>${esc(c.placa)}</dd>
          <dt>Proprietário</dt><dd>${esc(dono)}</dd>
        </dl>
        ${botaoReserva()}
      </div>
    </div>
    <section class="mt-5"><h2 class="h4">Sobre o modelo</h2><div id="wiki"><p>Buscando o resumo na Wikipedia...</p></div></section>`;
  const foto = criarImagem(c, "../", imagemPlaceholder, `${c.marca} ${c.modelo} ${c.ano}`);
  $("foto").append(foto);

  const resumo = await resumoDoCarro(c);
  if (!resumo) {
    $("wiki").innerHTML = "<p>Resumo indisponível no momento.</p>";
  } else {
    $("wiki").innerHTML = `<p class="texto-wiki">${esc(resumo.texto)}</p>
      <p class="small">Texto da Wikipedia, em inglês.${resumo.url ? ` <a href="${esc(resumo.url)}" target="_blank" rel="noopener">Ler o artigo completo</a>` : ""}</p>`;
    if (foto.dataset.semFoto && resumo.imagem) foto.src = resumo.imagem; // sem foto local, usa a da Wikipedia
  }
} catch (err) {
  erro(err instanceof TypeError ? "Não foi possível conectar à API. Verifique se o comando npm run api está rodando." : "Carro não encontrado.");
}
