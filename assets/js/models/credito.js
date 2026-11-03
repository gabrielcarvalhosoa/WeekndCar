// Contrato de crédito concedido por um banco (taxa em % ao mês)
export function validarCredito({ valor, parcelas, taxa }) {
  const erros = [];
  if (!(valor > 0)) erros.push("Informe um valor de crédito maior que zero.");
  if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > 48) erros.push("As parcelas precisam ser um número inteiro de 1 a 48.");
  if (!(taxa >= 0 && taxa <= 20)) erros.push("A taxa precisa estar entre 0% e 20% ao mês.");
  return erros;
}

// Parcela fixa (tabela Price)
export function calcularParcela(valor, parcelas, taxa) {
  const i = taxa / 100;
  return i === 0 ? valor / parcelas : (valor * i) / (1 - Math.pow(1 + i, -parcelas));
}
