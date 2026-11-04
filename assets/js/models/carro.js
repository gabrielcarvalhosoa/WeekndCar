// Regras de apresentação do Automóvel (alinhadas ao diagrama de classes)
export const CATEGORIAS = {
  muscle: "Muscle cars",
  europeu: "Esportivos europeus",
  conversivel: "Conversíveis",
};

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export const formatarMoeda = (valor) => moeda.format(valor);

// Ilustração usada quando o carro ainda não tem foto: silhueta de um clássico, sem texto
export function imagemPlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
    <rect width="400" height="250" fill="#E9DCC0"/>
    <path d="M62 160 L80 134 Q88 124 104 122 L148 118 Q168 92 198 88 L258 88 Q286 90 302 114 L336 120 Q354 124 356 142 L358 160 Z" fill="#3B2A20"/>
    <path d="M166 116 Q180 98 200 96 L254 96 Q272 98 284 116 Z" fill="#F4EBD9"/>
    <circle cx="124" cy="160" r="23" fill="#3B2A20" stroke="#E9DCC0" stroke-width="4"/><circle cx="124" cy="160" r="10" fill="#E9DCC0"/>
    <circle cx="300" cy="160" r="23" fill="#3B2A20" stroke="#E9DCC0" stroke-width="4"/><circle cx="300" cy="160" r="10" fill="#E9DCC0"/>
    <rect y="190" width="400" height="9" fill="#B3261E"/><rect y="201" width="400" height="9" fill="#D9A441"/><rect y="212" width="400" height="9" fill="#3B2A20"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
