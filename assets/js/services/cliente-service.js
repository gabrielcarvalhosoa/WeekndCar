// CRUD de cliente sobre o JSON Server
import { api } from "../api/api-client.js";

const COLECAO = "clientes";
const STATUS_ENCERRADOS = ["cancelado", "recusado"];

export const buscarPorId = (id) => api.buscar(COLECAO, id);
export const criar = (dados) => api.criar(COLECAO, dados);
export const atualizar = (id, dados) => api.atualizar(COLECAO, id, dados);

async function emUso(campo, valor, ignorarId) {
  const lista = await api.listar(COLECAO, `?${campo}=${encodeURIComponent(valor)}`);
  return lista.some((c) => c.id !== ignorarId);
}
export const emailEmUso = (email, ignorarId) => emUso("email", email, ignorarId);
export const cpfEmUso = (cpf, ignorarId) => emUso("cpf", cpf, ignorarId);

export async function excluir(id) {
  const pedidos = await api.listar("pedidos", `?clienteId=${id}`);
  if (pedidos.some((p) => !STATUS_ENCERRADOS.includes(p.status))) {
    throw new Error("Cancele os pedidos ativos antes de excluir o cadastro.");
  }
  await Promise.all(pedidos.map((p) => api.remover("pedidos", p.id)));
  await api.remover(COLECAO, id);
}
