# Diagrama de Pacotes (Visão Lógica) — WeekndCar

O enunciado divide o sistema em dois subsistemas: **gestão de pedidos e contratos** e **construção dinâmica das páginas web**. Os pacotes abaixo seguem essa divisão e adicionam os pacotes de integração externa e de persistência.

## Diagrama

```mermaid
flowchart TB
    subgraph WEB["Subsistema: Construção dinâmica das páginas web"]
        direction TB
        P1["pages<br/>telas HTML"]
        P2["components<br/>navbar, cards, carrossel, mapa"]
        P3["styles<br/>tema retrô 60-70"]
        P4["controllers<br/>eventos e renderização"]
    end

    subgraph NEG["Subsistema: Gestão de pedidos e contratos"]
        direction TB
        N1["models<br/>Cliente, Agente, Automovel, Pedido, Contrato, ContratoCredito"]
        N2["services<br/>regras de negócio e fluxo de status"]
        N3["auth<br/>login e controle de perfil"]
    end

    subgraph INT["Integração"]
        direction TB
        I1["api<br/>cliente Fetch do JSON Server"]
        I2["external<br/>ViaCEP, Open-Meteo, Wikipedia"]
    end

    subgraph PER["Persistência"]
        D1["json-server<br/>db.json"]
    end

    P1 --> P2
    P1 --> P3
    P1 --> P4
    P4 --> N2
    P4 --> N3
    N2 --> N1
    N3 --> N1
    N2 --> I1
    N3 --> I1
    P4 --> I2
    I1 --> D1
```

## Responsabilidade de cada pacote

| Pacote | Responsabilidade |
|--------|------------------|
| `pages` | Telas: catálogo, detalhe do carro, login, cadastro, meus pedidos, painel do agente |
| `components` | Partes reutilizáveis da interface, montadas com Bootstrap 5, Swiper e Leaflet |
| `styles` | Variáveis CSS da identidade visual (creme, vermelho, marrom-café, mostarda) |
| `controllers` | Ligam a interface às regras: capturam eventos e atualizam o DOM |
| `models` | Classes de domínio, alinhadas ao diagrama de classes |
| `services` | Regras do pedido (transições de status, validações) e do contrato |
| `auth` | Login simulado e bloqueio de telas por perfil (cliente ou agente) |
| `api` | Funções Fetch genéricas (GET, POST, PATCH, DELETE) para o JSON Server |
| `external` | Chamadas às APIs externas, isoladas para facilitar troca ou falha |
| `json-server` | `db.json` com as coleções `clientes`, `agentes`, `carros`, `pedidos`, `contratos` e `creditos` |

## Mapa para a estrutura de pastas

Mantém o código alinhado ao modelo, que é um dos critérios de avaliação.

```text
weekndcar/
├── db.json
├── index.html
├── docs/
├── pages/
├── assets/
│   ├── css/            # styles
│   ├── img/
│   └── js/
│       ├── components/
│       ├── controllers/
│       ├── models/
│       ├── services/
│       ├── auth/
│       ├── api/
│       └── external/
└── README.md
```
