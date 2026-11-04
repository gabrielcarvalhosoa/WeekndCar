// Pontos de retirada e devolução (locais de referência aproximados em Belo Horizonte, dados fictícios)
export const PONTOS = {
  1: {
    nome: "WeekndCar Savassi",
    bairro: "Savassi",
    endereco: "Praça da Savassi, Savassi, Belo Horizonte, MG",
    lat: -19.9393,
    lng: -43.933,
  },
  2: {
    nome: "Alterosa Clássicos",
    bairro: "Pampulha",
    endereco: "Próximo à Igreja da Pampulha, Pampulha, Belo Horizonte, MG",
    lat: -19.8583,
    lng: -43.9790,
  },
};

// O carro sai da empresa dona dele; carros de bancos ou de clientes saem do ponto da WeekndCar
export function pontoDeRetirada(carro) {
  const doDono = carro.proprietarioTipo === "empresa" ? PONTOS[carro.proprietarioId] : null;
  return doDono ?? PONTOS[1];
}

export const linkComoChegar = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
