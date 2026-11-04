# Diagrama de Pacotes (Visão Lógica) — WeekndCar

O enunciado divide o sistema em dois subsistemas: **gestão de pedidos e contratos** e **construção dinâmica das páginas web**. Os pacotes abaixo seguem essa divisão e acrescentam os pacotes de integração, de utilitários e a persistência. As setas mostram as dependências reais de importação do código (`import` entre as pastas de `assets/js`).

## Diagrama

```mermaid
flowchart TB
    subgraph WEB["Subsistema: Construção dinâmica das páginas web"]
        direction TB
        P1["pages e index.html<br/>telas HTML"]
        P3["assets/css<br/>tema retrô 60-70"]
        P4["controllers<br/>eventos e renderização"]
        P2["components<br/>navbar, cards, carrossel, mapa e histórico"]
    end

    subgraph NEG["Subsistema: Gestão de pedidos e contratos"]
        direction TB
        N1["models<br/>regras e validações"]
        N2["services<br/>operações sobre clientes, carros, pedidos, contratos e créditos"]
        N3["auth<br/>login simulado e sessão"]
    end

    subgraph INT["Integração"]
        direction TB
        I1["api<br/>cliente Fetch do JSON Server"]
        I2["external<br/>ViaCEP, Open-Meteo e Wikipedia"]
    end

    U["utils<br/>funções de texto"]
    D1["json-server<br/>db.json"]

    P1 --> P3
    P1 --> P4
    P4 --> P2
    P4 --> N1
    P4 --> N2
    P4 --> N3
    P4 --> I2
    P2 --> N1
    P2 --> N3
    P2 --> U
    N2 --> N1
    N2 --> I1
    N3 --> I1
    I1 --> D1
```

Não há dependências circulares: `models` e `utils` não dependem de nenhum outro pacote do sistema, e `controllers` é o único pacote que conhece todos os demais.

## Responsabilidade de cada pacote

| Pacote | Responsabilidade |
|--------|------------------|
| `pages` e `index.html` | Telas: catálogo, detalhe do carro, login, cadastro, novo pedido, meus pedidos e painel do agente |
| `assets/css` | Variáveis CSS da identidade visual (creme, vermelho, marrom-café, mostarda) e estilos das telas |
| `controllers` | Ligam a interface às regras: capturam eventos, chamam os serviços e atualizam o DOM |
| `components` | Partes reutilizáveis da interface: barra de navegação, cards, carrossel (Swiper), mapa (Leaflet), histórico e utilitários de DOM |
| `models` | Regras e validações de domínio: CPF, status do pedido, fins de semana, crédito, categorias e pontos de retirada |
| `services` | Operações sobre as coleções (CRUD e regras de fluxo): clientes, carros, pedidos, contratos, créditos e agentes |
| `auth` | Login simulado, sessão no navegador e bloqueio de telas por perfil (cliente ou agente) |
| `api` | Funções Fetch genéricas (GET, POST, PATCH e DELETE) para o JSON Server |
| `external` | Chamadas às APIs públicas, isoladas para facilitar troca ou falha |
| `utils` | Funções de texto sem dependências, como a que escapa HTML |
| `json-server` | `db.json` com as coleções `clientes`, `agentes`, `carros`, `pedidos`, `contratos` e `creditos` |

## Mapa para a estrutura de pastas

Mantém o código alinhado ao modelo, que é um dos critérios de avaliação.

```text
weekndcar/
├── db.json
├── index.html
├── serve.json            # configuração do servidor estático
├── package.json
├── LICENSE
├── README.md
├── docs/                 # modelagem UML
├── pages/                # demais telas HTML
└── assets/
    ├── css/              # styles
    ├── img/
    └── js/
        ├── controllers/
        ├── components/
        ├── models/
        ├── services/
        ├── auth/
        ├── api/
        ├── external/
        └── utils/
```
