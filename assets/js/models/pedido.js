// Regras do Pedido de aluguel (alinhadas ao diagrama de classes e ao ciclo de vida do pedido)
export const STATUS = {
  pendente: { rotulo: "Aguardando análise", classe: "status-pendente" },
  em_analise: { rotulo: "Em análise financeira", classe: "status-analise" },
  aprovado: { rotulo: "Aprovado", classe: "status-aprovado" },
  recusado: { rotulo: "Recusado", classe: "status-recusado" },
  contrato_executado: { rotulo: "Contrato executado", classe: "status-contrato" },
  cancelado: { rotulo: "Cancelado", classe: "status-cancelado" },
};

const OCUPAM_O_CARRO = ["pendente", "em_analise", "aprovado", "contrato_executado"];
const ALTERAVEIS = ["pendente", "em_analise"];
const CANCELAVEIS = ["pendente", "em_analise", "aprovado"];
export const ocupaOCarro = (p) => OCUPAM_O_CARRO.includes(p.status);
export const podeAlterar = (p) => ALTERAVEIS.includes(p.status);
export const podeCancelar = (p) => CANCELAVEIS.includes(p.status);

export const DIARIAS_FIM_DE_SEMANA = 2;
export const valorDoFimDeSemana = (diaria) => diaria * DIARIAS_FIM_DE_SEMANA;

// Datas como "AAAA-MM-DD" no fuso local, para não deslocar o dia
const pad = (n) => String(n).padStart(2, "0");
export const paraIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const deIso = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};

// Próximos sábados (sempre depois de hoje) com o domingo seguinte
export function proximosFinsDeSemana(qtd = 6, hoje = new Date()) {
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const ate = (6 - base.getDay() + 7) % 7 || 7;
  return Array.from({ length: qtd }, (_, i) => {
    const sabado = new Date(base.getFullYear(), base.getMonth(), base.getDate() + ate + 7 * i);
    const domingo = new Date(sabado.getFullYear(), sabado.getMonth(), sabado.getDate() + 1);
    return { retirada: paraIso(sabado), devolucao: paraIso(domingo) };
  });
}

const formatoDia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" });
const formatoSemana = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });
export const formatarDia = (iso) => formatoDia.format(deIso(iso));
export const nomeDoDia = (iso) => formatoSemana.format(deIso(iso));
export const formatarFimDeSemana = (f) => `${formatarDia(f.retirada)} e ${formatarDia(f.devolucao)}`;
export const formatarDataHora = (iso) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function validarFimDeSemana(retirada, devolucao, hoje = new Date()) {
  const erros = [];
  const r = deIso(retirada);
  const h = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (r.getDay() !== 6) erros.push("A retirada precisa ser em um sábado.");
  if (devolucao !== paraIso(new Date(r.getFullYear(), r.getMonth(), r.getDate() + 1))) erros.push("A devolução precisa ser no domingo seguinte.");
  if (r <= h) erros.push("Escolha um fim de semana que ainda não começou.");
  return erros;
}

// Não grava agenteId: o JSON Server não aceita chave estrangeira nula (ver docs/diagrama-de-classes.md)
export function novoPedido({ clienteId, carro, retirada, devolucao }) {
  const agora = new Date().toISOString();
  return {
    clienteId,
    carroId: carro.id,
    dataRetirada: retirada,
    dataDevolucao: devolucao,
    valorTotal: valorDoFimDeSemana(carro.diaria),
    status: "pendente",
    criadoEm: agora,
    historico: [{ status: "pendente", em: agora }],
  };
}

// Histórico de status: cada mudança vira uma linha, com nota opcional (parecer do agente, por exemplo)
export function registrarHistorico(pedido, status, nota) {
  const atual = pedido.historico?.length ? pedido.historico : [{ status: pedido.status, em: pedido.criadoEm }];
  return [...atual, { status, em: new Date().toISOString(), ...(nota ? { nota } : {}) }];
}

// Só o agente que assumiu o pedido pode avaliá-lo, modificá-lo ou executar o contrato
export function exigirResponsavel(pedido, agenteId, statusEsperado) {
  if (pedido.agenteId !== agenteId || pedido.status !== statusEsperado) {
    throw new Error("Este pedido não está sob a sua responsabilidade nesta etapa.");
  }
}
