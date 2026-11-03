// Novo pedido (?carroId=) ou alteração do fim de semana de um pedido (?editar=)
import { exigirCliente } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";
import { esc, criarImagem, mostrarAviso, mensagemDeErro } from "../components/dom.js";
import { CATEGORIAS, formatarMoeda, imagemPlaceholder } from "../models/carro.js";
import {
  DIARIAS_FIM_DE_SEMANA, formatarFimDeSemana, nomeDoDia, novoPedido, podeAlterar,
  proximosFinsDeSemana, valorDoFimDeSemana, validarFimDeSemana,
} from "../models/pedido.js";
import { buscarPorId as buscarCarro } from "../services/carro-service.js";
import * as pedidos from "../services/pedido-service.js";
import { previsaoFimDeSemana } from "../external/open-meteo.js";

const $ = (id) => document.getElementById(id);
const alvo = $("pedido");
const s = exigirCliente();
if (s) {
  renderNavbar($("navbar"), true);
  await iniciar(s);
}

async function iniciar(sessao) {
  const params = new URLSearchParams(location.search);
  try {
    let pedido = null;
    let carroId = params.get("carroId");
    if (params.get("editar")) {
      pedido = await pedidos.buscarPorId(params.get("editar"));
      if (pedido.clienteId !== sessao.id) throw new Error("Não encontramos o que você procurou.");
      if (!podeAlterar(pedido)) throw new Error("Este pedido não pode mais ser alterado.");
      carroId = pedido.carroId;
    }
    montar(sessao, await buscarCarro(carroId), pedido);
  } catch (err) {
    alvo.innerHTML = `<div class="alert alert-danger" role="alert">${esc(mensagemDeErro(err))} <a href="../index.html">Voltar ao catálogo</a></div>`;
  }
}

function montar(sessao, carro, pedido) {
  const fins = proximosFinsDeSemana(6);
  alvo.innerHTML = `
    <a href="${pedido ? "meus-pedidos.html" : `carro.html?id=${encodeURIComponent(carro.id)}`}">Voltar</a>
    <div class="row g-4 mt-1">
      <div class="col-lg-5">
        <div class="foto-detalhe" id="foto"></div>
        <h2 class="h4 mt-3">${esc(carro.marca)} ${esc(carro.modelo)}, ${esc(carro.ano)}</h2>
        <p>${esc(CATEGORIAS[carro.categoria] ?? carro.categoria)}. Diária de ${formatarMoeda(carro.diaria)}.</p>
      </div>
      <div class="col-lg-7">
        <form id="form-pedido" class="ficha p-4" novalidate>
          <h1 class="h2 mb-3">${pedido ? "Alterar o fim de semana" : "Reservar para o fim de semana"}</h1>
          <div id="msg" role="alert" class="alert d-none"></div>
          <label class="form-label" for="fim-de-semana">Fim de semana</label>
          <select class="form-select" id="fim-de-semana">
            ${fins.map((f) => `<option value="${f.retirada}" data-devolucao="${f.devolucao}"${pedido?.dataRetirada === f.retirada ? " selected" : ""}>${esc(formatarFimDeSemana(f))}</option>`).join("")}
          </select>
          <div id="previsao" class="previsao mt-3" aria-live="polite"></div>
          <p class="mt-3 mb-4">${DIARIAS_FIM_DE_SEMANA} diárias de ${formatarMoeda(carro.diaria)}: <strong>${formatarMoeda(valorDoFimDeSemana(carro.diaria))}</strong></p>
          <button id="btn-enviar" class="btn btn-wc" type="submit">${pedido ? "Salvar alteração" : "Enviar pedido"}</button>
        </form>
      </div>
    </div>`;
  $("foto").append(criarImagem(carro, "../", imagemPlaceholder, `${carro.marca} ${carro.modelo} ${carro.ano}`));

  const select = $("fim-de-semana");
  const escolhido = () => ({ retirada: select.value, devolucao: select.selectedOptions[0].dataset.devolucao });
  let ultima = 0;

  async function atualizarPrevisao() {
    const minha = ++ultima;
    const caixa = $("previsao");
    caixa.textContent = "Consultando a previsão do tempo em Belo Horizonte...";
    const f = escolhido();
    const dias = await previsaoFimDeSemana(f.retirada, f.devolucao);
    if (minha !== ultima) return; // o cliente já escolheu outro fim de semana
    if (!dias) {
      caixa.textContent = "Previsão indisponível agora. Ela aparece para os próximos 16 dias.";
      return;
    }
    const linhas = dias.map((d) =>
      `<div><strong>${esc(nomeDoDia(d.data))}:</strong> ${esc(d.descricao)}, ${d.min}° a ${d.max}°${d.chuva === null ? "" : `, chance de chuva de ${d.chuva}%`}</div>`);
    const chuvoso = dias.some((d) => (d.chuva ?? 0) >= 50);
    const dica = carro.categoria === "conversivel"
      ? `<div class="mt-1">${chuvoso ? "Há risco de chuva: leve a capota fechada." : "Tempo bom para rodar de capota aberta."}</div>` : "";
    caixa.innerHTML = linhas.join("") + dica;
  }

  select.addEventListener("change", atualizarPrevisao);
  atualizarPrevisao();

  $("form-pedido").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = escolhido();
    const botao = $("btn-enviar");
    const erros = validarFimDeSemana(f.retirada, f.devolucao);
    botao.disabled = true;
    try {
      if (!erros.length && (await pedidos.carroOcupado(carro.id, f.retirada, pedido?.id))) {
        erros.push("Este carro já está reservado nesse fim de semana. Escolha outro fim de semana.");
      }
      if (erros.length) {
        mostrarAviso($("msg"), erros);
        botao.disabled = false;
        return;
      }
      if (pedido) {
        await pedidos.alterarFimDeSemana(pedido.id, f.retirada, f.devolucao);
        location.href = "meus-pedidos.html?atualizado=1";
      } else {
        const criado = await pedidos.criar(novoPedido({ clienteId: sessao.id, carro, ...f }));
        location.href = `meus-pedidos.html?novo=${criado.id}`;
      }
    } catch (err) {
      mostrarAviso($("msg"), mensagemDeErro(err));
      botao.disabled = false;
    }
  });
}
