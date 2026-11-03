// Regras de validação do Cliente (alinhadas ao diagrama de classes)
export const MAX_RENDIMENTOS = 3;

export function cpfValido(cpf) {
  const n = String(cpf).replace(/\D/g, "");
  if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
  const digito = (tam) => {
    let soma = 0;
    for (let i = 0; i < tam; i++) soma += Number(n[i]) * (tam + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

export function validarCliente(c) {
  const erros = [];
  if (c.nome.length < 3) erros.push("Informe o nome completo.");
  if (!/^\S+@\S+\.\S+$/.test(c.email)) erros.push("Informe um e-mail válido.");
  if (c.senha.length < 6) erros.push("A senha precisa ter ao menos 6 caracteres.");
  if (!c.rg) erros.push("Informe o RG.");
  if (!cpfValido(c.cpf)) erros.push("O CPF informado não é válido.");
  if (!c.endereco) erros.push("Informe o endereço.");
  if (!c.profissao) erros.push("Informe a profissão.");
  if (c.rendimentos.length > MAX_RENDIMENTOS) erros.push(`Informe no máximo ${MAX_RENDIMENTOS} empregadores.`);
  if (c.rendimentos.some((r) => !r.entidadeEmpregadora || !(r.valor > 0))) {
    erros.push("Em cada empregador, informe o nome e um rendimento maior que zero.");
  }
  return erros;
}

export const rendaTotal = (cliente) => (cliente.rendimentos ?? []).reduce((soma, r) => soma + Number(r.valor), 0);
