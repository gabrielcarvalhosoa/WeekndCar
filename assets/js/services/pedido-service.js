// Pedidos de aluguel no JSON Server
import { api } from "../api/api-client.js";
import {
  exigirResponsavel, ocupaOCarro, podeAlterar, podeCancelar, registrarHistorico, validarFimDeSemana,
} from "../models/pedido.js";

const COLECAO = "pedidos";

export const listarDoCliente = (clienteId) => api.listar(COLECAO, `?clienteId=${clienteId}&_sort=criadoEm&_order=desc`);
export const buscarPorId = (id) => api.buscar(COLECAO, id);
export const criar = (dados) => api.criar(COLECAO, dados);

export async function carroOcupado(carroId, retirada, ignorarId) {
  const lista = await api.listar(COLECAO, `?carroId=${carroId}&dataRetirada=${retirada}`);
  return lista.some((p) => p.id !== ignorarId && ocupaOCarro(p));
}

export async function alterarFimDeSemana(id, retirada, devolucao) {
  const pedido = await api.buscar(COLECAO, id);
  if (!podeAlterar(pedido)) throw new Error("Este pedido não pode mais ser alterado.");
  return api.atualizar(COLECAO, id, { dataRetirada: retirada, dataDevolucao: devolucao });
}

export async function cancelar(id) {
  const pedido = await api.buscar(COLECAO, id);
  if (!podeCancelar(pedido)) throw new Error("Este pedido não pode mais ser cancelado.");
  return api.atualizar(COLECAO, id, { status: "cancelado", historico: registrarHistorico(pedido, "cancelado") });
}

// Ações do agente (empresa ou banco)
export const listarTodos = () => api.listar(COLECAO);

export async function assumir(id, agenteId) {
  const pedido = await api.buscar(COLECAO, id);
  if (pedido.status !== "pendente" || pedido.agenteId) throw new Error("Este pedido já foi assumido ou não está mais pendente.");
  return api.atualizar(COLECAO, id, {
    agenteId,
    status: "em_analise",
    historico: registrarHistorico(pedido, "em_analise", "Análise financeira iniciada"),
  });
}

export async function avaliar(id, agenteId, aprovado, parecer) {
  const pedido = await api.buscar(COLECAO, id);
  exigirResponsavel(pedido, agenteId, "em_analise");
  const status = aprovado ? "aprovado" : "recusado";
  return api.atualizar(COLECAO, id, { status, historico: registrarHistorico(pedido, status, parecer) });
}

export async function modificarPeloAgente(id, agenteId, { retirada, devolucao, valorTotal }) {
  const pedido = await api.buscar(COLECAO, id);
  exigirResponsavel(pedido, agenteId, "em_analise");
  const erros = validarFimDeSemana(retirada, devolucao);
  if (erros.length) throw new Error(erros[0]);
  if (!(valorTotal > 0)) throw new Error("Informe um valor total maior que zero.");
  if (await carroOcupado(pedido.carroId, retirada, pedido.id)) throw new Error("Este carro já está reservado nesse fim de semana.");
  return api.atualizar(COLECAO, id, {
    dataRetirada: retirada,
    dataDevolucao: devolucao,
    valorTotal,
    historico: registrarHistorico(pedido, pedido.status, "Pedido modificado pelo agente"),
  });
}
