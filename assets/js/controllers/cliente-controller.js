// Tela de cadastro: cria um cliente (visitante) ou consulta, altera e exclui (cliente logado)
import { sessao, entrar, sair } from "../auth/auth.js";
import { renderNavbar } from "../components/navbar.js";
import { buscarCep } from "../external/viacep.js";
import { MAX_RENDIMENTOS, validarCliente } from "../models/cliente.js";
import * as clientes from "../services/cliente-service.js";

const s = sessao();
if (s && s.tipo !== "cliente") location.replace("../index.html");
renderNavbar(document.getElementById("navbar"), true);

const $ = (id) => document.getElementById(id);
const form = $("form-cliente");
const campos = ["nome", "email", "senha", "rg", "cpf", "cep", "endereco", "profissao"];
const editando = s?.tipo === "cliente";

function aviso(texto, tipo = "danger") {
  const caixa = $("msg");
  caixa.className = `alert alert-${tipo}`;
  caixa.replaceChildren(...[].concat(texto).map((t) => Object.assign(document.createElement("div"), { textContent: t })));
  caixa.scrollIntoView({ block: "nearest" });
}
const erroDeRede = (err) =>
  err instanceof TypeError ? "Não foi possível conectar à API. Verifique se o comando npm run api está rodando." : err.message;

const atualizarBotaoRenda = () => {
  $("btn-add-renda").disabled = $("rendimentos").children.length >= MAX_RENDIMENTOS;
};

function addRenda(empregador = "", valor = "") {
  const caixa = $("rendimentos");
  if (caixa.children.length >= MAX_RENDIMENTOS) return;
  const linha = document.createElement("div");
  linha.className = "input-group";
  linha.innerHTML = `
    <input class="form-control emp" placeholder="Entidade empregadora" aria-label="Entidade empregadora">
    <input class="form-control val" type="number" min="0" step="0.01" placeholder="Rendimento mensal (R$)" aria-label="Rendimento mensal">
    <button type="button" class="btn btn-outline-dark">Remover</button>`;
  linha.querySelector(".emp").value = empregador;
  linha.querySelector(".val").value = valor;
  linha.querySelector("button").addEventListener("click", () => {
    linha.remove();
    atualizarBotaoRenda();
  });
  caixa.append(linha);
  atualizarBotaoRenda();
}

function lerDados() {
  const dados = Object.fromEntries(campos.map((c) => [c, form.elements[c].value.trim()]));
  dados.senha = form.elements.senha.value;
  dados.rendimentos = [...$("rendimentos").children].map((l) => ({
    entidadeEmpregadora: l.querySelector(".emp").value.trim(),
    valor: Number(l.querySelector(".val").value),
  }));
  return dados;
}

$("btn-add-renda").addEventListener("click", () => addRenda());

$("btn-cep").addEventListener("click", async () => {
  try {
    form.elements.endereco.value = await buscarCep(form.elements.cep.value);
    form.elements.endereco.focus();
    aviso("Endereço preenchido. Acrescente o número, se precisar.", "info");
  } catch (err) {
    aviso(erroDeRede(err));
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = lerDados();
  delete dados.cep; // o CEP só serve para buscar o endereço
  const erros = validarCliente(dados);
  try {
    if (!erros.length) {
      if (await clientes.emailEmUso(dados.email, s?.id)) erros.push("Este e-mail já está cadastrado.");
      if (await clientes.cpfEmUso(dados.cpf, s?.id)) erros.push("Este CPF já está cadastrado.");
    }
    if (erros.length) return aviso(erros);
    if (editando) {
      await clientes.atualizar(s.id, dados);
      await entrar(dados.email, dados.senha); // renova o nome exibido na sessão
      renderNavbar($("navbar"), true);
      aviso("Cadastro atualizado.", "success");
    } else {
      await clientes.criar(dados);
      await entrar(dados.email, dados.senha);
      location.href = "../index.html";
    }
  } catch (err) {
    aviso(erroDeRede(err));
  }
});

$("btn-excluir").addEventListener("click", async () => {
  if (!confirm("Excluir seu cadastro? Essa ação não pode ser desfeita.")) return;
  try {
    await clientes.excluir(s.id);
    sair();
    location.href = "../index.html";
  } catch (err) {
    aviso(erroDeRede(err));
  }
});

if (editando) {
  $("titulo").textContent = "Meu cadastro";
  $("subtitulo").textContent = "Consulte e atualize seus dados.";
  $("btn-salvar").textContent = "Salvar alterações";
  $("btn-excluir").classList.remove("d-none");
  try {
    const c = await clientes.buscarPorId(s.id);
    campos.forEach((k) => { if (k in c) form.elements[k].value = c[k]; });
    c.rendimentos.forEach((r) => addRenda(r.entidadeEmpregadora, r.valor));
  } catch (err) {
    aviso(erroDeRede(err));
  }
}
