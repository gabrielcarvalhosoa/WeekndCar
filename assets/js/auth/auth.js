// Login simulado (didático): a sessão fica no sessionStorage do navegador
import { api } from "../api/api-client.js";

const CHAVE = "weekndcar.sessao";

export function sessao() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export async function entrar(email, senha) {
  const consulta = `?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`;
  for (const [tipo, colecao] of [["cliente", "clientes"], ["agente", "agentes"]]) {
    const [usuario] = await api.listar(colecao, consulta);
    if (usuario) {
      const dados = { tipo, id: usuario.id, nome: usuario.nome ?? usuario.razaoSocial };
      sessionStorage.setItem(CHAVE, JSON.stringify(dados));
      return dados;
    }
  }
  throw new Error("E-mail ou senha incorretos.");
}

export function sair() {
  sessionStorage.removeItem(CHAVE);
}

// Telas só de cliente: sem sessão de cliente, volta para o login
export function exigirCliente(destino = "login.html") {
  const s = sessao();
  if (s?.tipo === "cliente") return s;
  location.replace(destino);
  return null;
}
