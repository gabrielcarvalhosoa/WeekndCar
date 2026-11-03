// Pedidos de aluguel no JSON Server
import { api } from "../api/api-client.js";
import { ocupaOCarro, podeAlterar, podeCancelar } from "../models/pedido.js";

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
  const historico = [...(pedido.historico ?? []), { status: "cancelado", em: new Date().toISOString() }];
  return api.atualizar(COLECAO, id, { status: "cancelado", historico });
}
