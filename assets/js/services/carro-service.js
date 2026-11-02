// Consulta do catálogo no JSON Server
import { api } from "../api/api-client.js";

export const listar = () => api.listar("carros");
export const buscarPorId = (id) => api.buscar("carros", id);

export async function nomeDoProprietario(carro) {
  if (carro.proprietarioTipo === "cliente") return "Proprietário particular";
  try {
    return (await api.buscar("agentes", carro.proprietarioId)).razaoSocial;
  } catch {
    return "Não informado";
  }
}
