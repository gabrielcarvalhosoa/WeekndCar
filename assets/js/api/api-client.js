// Cliente Fetch genérico para o JSON Server
export const BASE_URL = "http://localhost:3000";

async function request(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${caminho}`);
  }
  return resposta.status === 204 ? null : resposta.json();
}

export const api = {
  listar: (colecao, consulta = "") => request(`/${colecao}${consulta}`),
  buscar: (colecao, id) => request(`/${colecao}/${id}`),
  criar: (colecao, dados) =>
    request(`/${colecao}`, { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (colecao, id, dados) =>
    request(`/${colecao}/${id}`, { method: "PATCH", body: JSON.stringify(dados) }),
  remover: (colecao, id) => request(`/${colecao}/${id}`, { method: "DELETE" }),
};
