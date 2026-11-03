// Regras de apresentação do Automóvel (alinhadas ao diagrama de classes)
import { esc } from "../utils/texto.js";

export const CATEGORIAS = {
  muscle: "Muscle cars",
  europeu: "Esportivos europeus",
  conversivel: "Conversíveis",
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const formatarMoeda = (valor) => moeda.format(valor);

export function imagemPlaceholder(c) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
    <rect width="400" height="250" fill="#E9DCC0"/>
    <rect y="150" width="400" height="10" fill="#B3261E"/><rect y="162" width="400" height="10" fill="#D9A441"/><rect y="174" width="400" height="10" fill="#3B2A20"/>
    <text x="200" y="95" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="#3B2A20">${esc(c.marca)}</text>
    <text x="200" y="128" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#3B2A20">${esc(c.modelo)}</text>
    <text x="200" y="220" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#3B2A20">${esc(c.ano)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
