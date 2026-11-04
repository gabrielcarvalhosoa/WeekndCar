// Painel do agente (empresa ou banco): assumir, avaliar, modificar, executar contrato e conceder crédito
import { exigirAgente } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";
import { esc, mostrarAviso, mensagemDeErro } from "../components/dom.js";
import { historicoHtml } from "../components/historico.js";
import { formatarMoeda } from "../models/carro.js";
import { rendaTotal } from "../models/cliente.js";
import { calcularParcela } from "../models/credito.js";
import { STATUS, formatarDia, formatarFimDeSemana, proximosFinsDeSemana } from "../models/pedido.js";
import { listar as listarAgentes } from "../services/agente-service.js";
import { listar as listarCarros } from "../services/carro-service.js";
import { listar as listarClientes } from "../services/cliente-service.js";
import * as contratos from "../services/contrato-service.js";
import * as pedidos from "../services/pedido-service.js";

// Estado da tela (declarado antes de qualquer uso)
const $ = (id) => document.getElementById(id);
let agente = null;
let filtro = "novos";
let dados = { pedidos: [], carros: new Map(), clientes: new Map(), agentes: new Map(), contratos: new Map(), creditos: new Map() };

const s = exigirAgente();
if (s) {
  renderNavbar($("navbar"), true);
  await carregar();
  $("filtros").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filtro]");
    if (b) { filtro = b.dataset.filtro; desenhar(); }
  });
  $("lista").addEventListener("click", aoClicar);
  $("lista").addEventListener("submit", aoEnviar);
}

function creditoDoPedido(p) {
  return dados.creditos.get(dados.contratos.get(p.id)?.id);
}

function filtros() {
  const meu = (p) => p.agenteId === agente.id;
  const f = [
    ["novos", "Novos pedidos", (p) => p.status === "pendente"],
    ["analise", "Em análise", (p) => p.status === "em_analise" && meu(p)],
    ["aprovados", "Aprovados", (p) => p.status === "aprovado" && meu(p)],
    ["contratos", "Contratos", (p) => p.status === "contrato_executado" && (meu(p) || creditoDoPedido(p)?.bancoId === agente.id)],
  ];
  if (agente.tipo === "banco") f.push(["credito", "Crédito a conceder", (p) => p.status === "contrato_executado" && !creditoDoPedido(p)]);
  return f;
}

async function carregar() {
  try {
    const [ped, carros, clientes, agentes, ctr, cred] = await Promise.all([
      pedidos.listarTodos(), listarCarros(), listarClientes(), listarAgentes(), contratos.listarContratos(), contratos.listarCreditos(),
    ]);
    const porId = (l) => new Map(l.map((x) => [x.id, x]));
    dados = {
      pedidos: ped.sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)),
      carros: porId(carros), clientes: porId(clientes), agentes: porId(agentes),
      contratos: new Map(ctr.map((c) => [c.pedidoId, c])), creditos: new Map(cred.map((c) => [c.contratoId, c])),
    };
    agente = dados.agentes.get(s.id);
    if (!agente) throw new Error("Agente não encontrado.");
    desenhar();
  } catch (err) {
    $("lista").innerHTML = `<div class="alert alert-danger" role="alert">${esc(mensagemDeErro(err))}</div>`;
  }
}

function desenhar() {
  $("quem").textContent = `${agente.razaoSocial} (${agente.tipo === "banco" ? "banco" : "empresa"})`;
  const lista = filtros();
  $("filtros").innerHTML = lista
    .map(([chave, nome, teste]) => `<button type="button" class="btn btn-filtro" data-filtro="${chave}" aria-pressed="${chave === filtro}">${nome} (${dados.pedidos.filter(teste).length})</button>`)
    .join("");
  const atual = lista.find(([chave]) => chave === filtro) ?? lista[0];
  const itens = dados.pedidos.filter(atual[2]);
  $("lista").innerHTML = itens.length ? itens.map(cardPedido).join("") : `<p>Nenhum pedido nesta etapa.</p>`;
}

function acoes(p) {
  const meu = p.agenteId === agente.id;
  if (p.status === "pendente" && !p.agenteId) return `<button class="btn btn-wc btn-sm" type="button" data-acao="assumir" data-id="${esc(p.id)}">Assumir análise</button>`;
  if (p.status === "em_analise" && meu) {
    const fins = proximosFinsDeSemana(6);
    const opcoes = fins.some((f) => f.retirada === p.dataRetirada) ? fins : [{ retirada: p.dataRetirada, devolucao: p.dataDevolucao }, ...fins];
    return `
      <label class="form-label" for="parecer-${esc(p.id)}">Parecer (opcional, o cliente verá)</label>
      <textarea id="parecer-${esc(p.id)}" class="form-control mb-2" rows="2" maxlength="300"></textarea>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-wc btn-sm" type="button" data-acao="aprovar" data-id="${esc(p.id)}">Aprovar</button>
        <button class="btn btn-outline-danger btn-sm" type="button" data-acao="recusar" data-id="${esc(p.id)}">Recusar</button>
      </div>
      <details class="mt-3"><summary>Modificar pedido</summary>
        <form class="row g-2 mt-1" data-form="modificar" data-id="${esc(p.id)}">
          <div class="col-md-7"><label class="form-label" for="fim-${esc(p.id)}">Fim de semana</label>
            <select class="form-select" id="fim-${esc(p.id)}" name="fim">${opcoes.map((f) => `<option value="${f.retirada}" data-devolucao="${f.devolucao}"${f.retirada === p.dataRetirada ? " selected" : ""}>${esc(formatarFimDeSemana(f))}</option>`).join("")}</select></div>
          <div class="col-md-5"><label class="form-label" for="valor-${esc(p.id)}">Valor total (R$)</label>
            <input class="form-control" id="valor-${esc(p.id)}" name="valor" type="number" min="1" step="0.01" value="${esc(p.valorTotal)}"></div>
          <div class="col-12"><button class="btn btn-outline-dark btn-sm" type="submit">Salvar modificação</button></div>
        </form></details>`;
  }
  if (p.status === "aprovado" && meu) return `<button class="btn btn-wc btn-sm" type="button" data-acao="contrato" data-id="${esc(p.id)}">Executar contrato</button>`;
  if (p.status === "contrato_executado") {
    const ctr = dados.contratos.get(p.id);
    const cred = creditoDoPedido(p);
    if (cred) {
      const banco = dados.agentes.get(cred.bancoId)?.razaoSocial ?? "banco";
      return `<div class="destaque-lateral">Contrato nº ${esc(ctr.id)}, ${esc(ctr.tipo)}. Crédito do ${esc(banco)}: ${formatarMoeda(cred.valor)} em ${esc(cred.parcelas)} parcelas de ${formatarMoeda(calcularParcela(cred.valor, cred.parcelas, cred.taxa))}, taxa de ${esc(cred.taxa)}% ao mês.</div>`;
    }
    const base = `<div class="destaque-lateral mb-2">Contrato nº ${esc(ctr?.id)}, ${esc(ctr?.tipo)}. Sem crédito.</div>`;
    if (agente.tipo !== "banco" || !ctr) return base;
    return `${base}
      <form class="row g-2" data-form="credito" data-contrato="${esc(ctr.id)}">
        <div class="col-md-4"><label class="form-label" for="cv-${esc(p.id)}">Valor (R$)</label><input class="form-control" id="cv-${esc(p.id)}" name="valor" type="number" min="1" step="0.01" value="${esc(p.valorTotal)}"></div>
        <div class="col-md-4"><label class="form-label" for="cp-${esc(p.id)}">Parcelas</label><input class="form-control" id="cp-${esc(p.id)}" name="parcelas" type="number" min="1" max="48" step="1" value="3"></div>
        <div class="col-md-4"><label class="form-label" for="ct-${esc(p.id)}">Taxa (% ao mês)</label><input class="form-control" id="ct-${esc(p.id)}" name="taxa" type="number" min="0" max="20" step="0.01" value="1.9"></div>
        <div class="col-12"><button class="btn btn-wc btn-sm" type="submit">Conceder crédito</button></div>
      </form>`;
  }
  return "";
}

function cardPedido(p) {
  const c = dados.carros.get(p.carroId);
  const cli = dados.clientes.get(p.clienteId);
  const st = STATUS[p.status] ?? { rotulo: p.status, classe: "status-pendente" };
  return `
    <article class="pedido">
      <div class="pedido-topo">
        <h2 class="h5 mb-0">Pedido ${esc(p.id)}: ${c ? `${esc(c.marca)} ${esc(c.modelo)}, ${esc(c.ano)}` : "carro removido"}</h2>
        <span class="status ${st.classe}">${esc(st.rotulo)}</span>
      </div>
      <p class="mb-1">Cliente: <strong>${esc(cli?.nome ?? "removido")}</strong>${cli ? `, ${esc(cli.profissao)}. Renda mensal declarada: <strong>${formatarMoeda(rendaTotal(cli))}</strong> em ${cli.rendimentos.length} ${cli.rendimentos.length === 1 ? "empregador" : "empregadores"}.` : "."}</p>
      <p class="mb-1">Retirada: ${esc(formatarDia(p.dataRetirada))}. Devolução: ${esc(formatarDia(p.dataDevolucao))}.</p>
      <p class="mb-2">Valor total: <strong>${formatarMoeda(p.valorTotal)}</strong></p>
      <details class="mb-3"><summary>Histórico do pedido</summary><ul class="mt-2 mb-0">${historicoHtml(p)}</ul></details>
      ${acoes(p)}
    </article>`;
}

async function executar(tarefa, sucesso, botao) {
  if (botao) botao.disabled = true;
  try {
    await tarefa();
    await carregar();
    mostrarAviso($("msg"), sucesso, "success");
  } catch (err) {
    mostrarAviso($("msg"), mensagemDeErro(err));
    if (botao) botao.disabled = false;
  }
}

function aoClicar(e) {
  const b = e.target.closest("[data-acao]");
  if (!b) return;
  const { acao, id } = b.dataset;
  const parecer = () => b.closest("article").querySelector("textarea")?.value.trim() || undefined;
  if (acao === "assumir") executar(() => pedidos.assumir(id, agente.id), "Pedido assumido. Ele está na aba Em análise.", b);
  if (acao === "aprovar") executar(() => pedidos.avaliar(id, agente.id, true, parecer()), "Pedido aprovado. Ele está na aba Aprovados.", b);
  if (acao === "recusar" && confirm("Recusar este pedido? O cliente será informado.")) executar(() => pedidos.avaliar(id, agente.id, false, parecer()), "Pedido recusado.", b);
  if (acao === "contrato") executar(() => contratos.executar(id, agente.id), "Contrato executado. Ele está na aba Contratos.", b);
}

function aoEnviar(e) {
  e.preventDefault();
  const f = e.target;
  if (f.dataset.form === "modificar") {
    const opcao = f.elements.fim.selectedOptions[0];
    executar(() => pedidos.modificarPeloAgente(f.dataset.id, agente.id, { retirada: opcao.value, devolucao: opcao.dataset.devolucao, valorTotal: Number(f.elements.valor.value) }), "Pedido modificado.");
  }
  if (f.dataset.form === "credito") {
    const dadosCredito = { valor: Number(f.elements.valor.value), parcelas: Number(f.elements.parcelas.value), taxa: Number(f.elements.taxa.value) };
    executar(() => contratos.concederCredito(f.dataset.contrato, agente, dadosCredito), "Crédito concedido e vinculado ao contrato.");
  }
}
