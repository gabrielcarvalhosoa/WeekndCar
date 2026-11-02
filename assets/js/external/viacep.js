// Consulta de endereço pelo CEP (ViaCEP, sem chave de acesso)
export async function buscarCep(cep) {
  const limpo = cep.replace(/\D/g, "");
  if (limpo.length !== 8) throw new Error("O CEP precisa ter 8 números.");
  const resposta = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
  if (!resposta.ok) throw new Error("Não foi possível consultar o CEP agora.");
  const d = await resposta.json();
  if (d.erro) throw new Error("CEP não encontrado.");
  return [d.logradouro, d.bairro, d.localidade, d.uf].filter(Boolean).join(", ");
}
