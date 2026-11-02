// Utilitários de DOM compartilhados pelos componentes
export const esc = (t) =>
  String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Imagem do carro: se a foto não existir, troca por uma ilustração retrô gerada no navegador
export function criarImagem(carro, raiz, placeholder, alt = "") {
  const img = document.createElement("img");
  img.alt = alt;
  img.loading = "lazy";
  img.src = `${raiz}${carro.foto}`;
  img.addEventListener("error", () => {
    img.dataset.semFoto = "1";
    img.src = placeholder(carro);
  }, { once: true });
  return img;
}
