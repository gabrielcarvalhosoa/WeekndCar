// Meus pedidos: lista com status, histórico, alteração e cancelamento
import { exigirCliente } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";
import { esc, mostrarAviso, mensagemDeErro } from "../components/dom.js";
import { formatarMoeda } from "../models/carro.js";
import { STATUS, formatarDataHora, formatarDia, podeAlterar, podeCancelar } from "../models/pedido.js";
import { listar as listarCarros } from "../services/carro-service.js";
import * as pedidos from "../services/pedido-service.js";

const $ = (id) => document.getElementById(id);
let carros = new Map(); // carros do catálogo, por id (declarado antes do uso)
const s = exigirCliente();
if (s) {
  renderNavbar($("navbar"), true);
  const params = new URLSearchParams(location.search);
  if (params.get("novo")) mostrarAviso($("msg"), "Pedido enviado. Um agente vai analisar o seu pedido em breve.", "success");
  if (params.get("atualizado")) mostrarAviso($("msg"), "Fim de semana alterado.", "success");
  await carregar();
  $("lista").addEventListener("click", cancelarPedido);
}


async function carregar() {
  try {
    const [lista, todos] = await Promise.all([pedidos.listarDoCliente(s.id), listarCarros()]);
    carros = new Map(todos.map((c) => [c.id, c]));
    desenhar(lista);
  } catch (err) {
    $("lista").innerHTML = `<div class="alert alert-danger" role="alert">${esc(mensagemDeErro(err))}</div>`;
  }
}

function desenhar(lista) {
  if (!lista.length) {
    $("lista").innerHTML = `<p>Você ainda não tem pedidos. <a href="../index.html">Escolha um clássico no catálogo</a> e reserve o seu fim de semana.</p>`;
    return;
  }
  $("lista").innerHTML = lista.map((p) => {
    const c = carros.get(p.carroId);
    const st = STATUS[p.status] ?? { rotulo: p.status, classe: "status-pendente" };
    const historico = (p.historico?.length ? p.historico : [{ status: p.status, em: p.criadoEm }])
      .map((h) => `<li>${esc((STATUS[h.status] ?? { rotulo: h.status }).rotulo)}, em ${esc(formatarDataHora(h.em))}</li>`).join("");
    return `
      <article class="pedido">
        <div class="pedido-topo">
          <h2 class="h5 mb-0">${c ? `${esc(c.marca)} ${esc(c.modelo)}, ${esc(c.ano)}` : "Carro removido do catálogo"}</h2>
          <span class="status ${st.classe}">${esc(st.rotulo)}</span>
        </div>
        <p class="mb-1">Retirada: ${esc(formatarDia(p.dataRetirada))}. Devolução: ${esc(formatarDia(p.dataDevolucao))}.</p>
        <p class="mb-2">Valor total: <strong>${formatarMoeda(p.valorTotal)}</strong></p>
        <details><summary>Histórico do pedido</summary><ul class="mt-2 mb-0">${historico}</ul></details>
        <div class="d-flex flex-wrap gap-2 mt-3">
          ${podeAlterar(p) ? `<a class="btn btn-outline-dark btn-sm" href="pedido.html?editar=${encodeURIComponent(p.id)}">Alterar fim de semana</a>` : ""}
          ${podeCancelar(p) ? `<button class="btn btn-outline-danger btn-sm" type="button" data-cancelar="${esc(p.id)}">Cancelar pedido</button>` : ""}
        </div>
      </article>`;
  }).join("");
}

async function cancelarPedido(e) {
  const botao = e.target.closest("[data-cancelar]");
  if (!botao || !confirm("Cancelar este pedido? Essa ação não pode ser desfeita.")) return;
  try {
    await pedidos.cancelar(botao.dataset.cancelar);
    await carregar();
    mostrarAviso($("msg"), "Pedido cancelado.", "success");
  } catch (err) {
    mostrarAviso($("msg"), mensagemDeErro(err));
  }
}
