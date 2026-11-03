// Previsão do tempo de Belo Horizonte (Open-Meteo, sem chave). Em qualquer falha devolve null.
const BH = { latitude: -19.9167, longitude: -43.9345 };

const DESCRICOES = [
  [[0], "céu limpo"], [[1, 2], "poucas nuvens"], [[3], "nublado"], [[45, 48], "neblina"],
  [[51, 53, 55, 56, 57], "garoa"], [[61, 63, 65, 66, 67], "chuva"], [[80, 81, 82], "pancadas de chuva"], [[95, 96, 99], "tempestade"],
];
export const descreverTempo = (codigo) => DESCRICOES.find(([codigos]) => codigos.includes(codigo))?.[1] ?? "tempo variável";

export async function previsaoFimDeSemana(inicio, fim) {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.search = new URLSearchParams({
      ...BH,
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "America/Sao_Paulo",
      start_date: inicio,
      end_date: fim,
    });
    const resposta = await fetch(url);
    if (!resposta.ok) return null; // datas além dos 16 dias de previsão voltam com erro
    const { daily } = await resposta.json();
    return daily.time.map((data, i) => ({
      data,
      descricao: descreverTempo(daily.weather_code[i]),
      max: Math.round(daily.temperature_2m_max[i]),
      min: Math.round(daily.temperature_2m_min[i]),
      chuva: daily.precipitation_probability_max?.[i] ?? null,
    }));
  } catch {
    return null;
  }
}
