// Contratos de aluguel e contratos de crédito
import { api } from "../api/api-client.js";
import { exigirResponsavel, paraIso, registrarHistorico } from "../models/pedido.js";
import { validarCredito } from "../models/credito.js";

export const listarContratos = () => api.listar("contratos");
export const listarCreditos = () => api.listar("creditos");

export async function executar(pedidoId, agenteId) {
  const pedido = await api.buscar("pedidos", pedidoId);
  exigirResponsavel(pedido, agenteId, "aprovado");
  const contrato = await api.criar("contratos", { pedidoId: pedido.id, agenteId, dataExecucao: paraIso(new Date()), tipo: "aluguel" });
  await api.atualizar("pedidos", pedido.id, {
    status: "contrato_executado",
    historico: registrarHistorico(pedido, "contrato_executado", `Contrato nº ${contrato.id} executado`),
  });
  return contrato;
}

export async function concederCredito(contratoId, banco, dados) {
  contratoId = Number(contratoId); // vem do HTML como texto; o JSON Server guarda ids numéricos
  if (banco.tipo !== "banco") throw new Error("Somente bancos concedem crédito.");
  const erros = validarCredito(dados);
  if (erros.length) throw new Error(erros[0]);
  if ((await api.listar("creditos", `?contratoId=${contratoId}`)).length) throw new Error("Este contrato já tem crédito.");
  const credito = await api.criar("creditos", { contratoId, bancoId: banco.id, ...dados });
  await api.atualizar("contratos", contratoId, { tipo: "aluguel com crédito" });
  return credito;
}
