// Carrossel de destaques (Swiper, carregado por CDN como window.Swiper)
import { esc, criarImagem } from "./dom.js";
import { imagemPlaceholder } from "../models/carro.js";

export function montarCarrossel(alvo, carros) {
  if (!window.Swiper) {
    alvo.hidden = true; // sem a biblioteca, o catálogo abaixo continua funcionando
    return;
  }
  alvo.innerHTML = `
    <div class="swiper" aria-label="Carros em destaque">
      <div class="swiper-wrapper">
        ${carros.map((c) => `
          <div class="swiper-slide">
            <a class="slide-carro" href="pages/carro.html?id=${encodeURIComponent(c.id)}">
              <span class="slide-legenda"><span class="slide-marca">${esc(c.marca)}</span><span class="slide-modelo">${esc(c.modelo)}, ${esc(c.ano)}</span></span>
            </a>
          </div>`).join("")}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev" aria-label="Anterior"></div>
      <div class="swiper-button-next" aria-label="Próximo"></div>
    </div>`;
  alvo.querySelectorAll(".slide-carro").forEach((link, i) => {
    const c = carros[i];
    link.prepend(criarImagem(c, "", imagemPlaceholder, `${c.marca} ${c.modelo} ${c.ano}`));
  });
  new window.Swiper(alvo.querySelector(".swiper"), {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: { 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  });
}
