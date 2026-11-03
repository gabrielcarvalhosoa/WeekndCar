// Itens de lista do histórico de status de um pedido (com o parecer, quando houver)
import { esc } from "./dom.js";
import { STATUS, formatarDataHora } from "../models/pedido.js";

export function historicoHtml(pedido) {
  const itens = pedido.historico?.length ? pedido.historico : [{ status: pedido.status, em: pedido.criadoEm }];
  return itens
    .map((h) => `<li>${esc((STATUS[h.status] ?? { rotulo: h.status }).rotulo)}, em ${esc(formatarDataHora(h.em))}${h.nota ? `. ${esc(h.nota)}` : ""}</li>`)
    .join("");
}
