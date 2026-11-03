// Mapa do ponto de retirada (Leaflet com OpenStreetMap, carregado por CDN como window.L)
export function montarMapa(alvo, ponto) {
  if (!window.L) {
    alvo.textContent = "Mapa indisponível no momento. Use o link Como chegar.";
    return null;
  }
  const L = window.L;
  const mapa = L.map(alvo, { scrollWheelZoom: false }).setView([ponto.lat, ponto.lng], 15);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">Colaboradores do OpenStreetMap</a>',
  }).addTo(mapa);
  const pino = L.divIcon({ className: "", html: '<span class="pino-wc"></span>', iconSize: [22, 22], iconAnchor: [11, 26] });
  L.marker([ponto.lat, ponto.lng], { icon: pino, title: ponto.nome }).addTo(mapa).bindTooltip(ponto.nome);
  return mapa;
}
