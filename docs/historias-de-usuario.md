# Histórias do Usuário — WeekndCar

Os critérios de aceitação descrevem o comportamento que está implementado no protótipo.

## Visitante

**HU01 — Filtrar catálogo**
Como visitante, quero filtrar os carros por categoria (muscle car, esportivo europeu, conversível) para encontrar o que combina com o meu fim de semana.
- Critérios de aceitação:
  - O catálogo é carregado do JSON Server via Fetch API.
  - Os filtros atualizam a lista sem recarregar a página e mostram a quantidade de carros.
  - Cada card mostra foto (ou uma ilustração, se não houver foto), marca, modelo, ano e diária.
  - A página inicial tem um carrossel com os carros de maior diária.

**HU02 — Ver detalhes do carro**
Como visitante, quero ver os detalhes de um carro para decidir se vale a pena alugá-lo.
- Critérios de aceitação:
  - A página mostra matrícula, ano, marca, modelo, placa, categoria, proprietário, diária e o valor do fim de semana (2 diárias).
  - Um resumo do modelo é buscado na API da Wikipedia (em inglês), com link para o artigo.
  - Se a Wikipedia estiver indisponível, a página mostra um aviso e continua funcionando.

**HU03 — Ver o ponto de retirada no mapa**
Como visitante, quero ver onde o carro é retirado e devolvido para saber como chegar.
- Critérios de aceitação:
  - A página do carro mostra o nome e o endereço do ponto de retirada e um mapa (Leaflet com OpenStreetMap).
  - O link "Como chegar" abre a rota no Google Maps.
  - Carros de empresa saem do ponto da empresa; carros de bancos e de clientes saem do ponto da WeekndCar.
  - Se o mapa não carregar, a página mostra um aviso e mantém o link.

**HU04 — Cadastrar-se**
Como visitante, quero me cadastrar informando o CEP para que o endereço seja preenchido automaticamente.
- Critérios de aceitação:
  - Campos: nome, e-mail, senha, RG, CPF, CEP, endereço, profissão e até 3 empregadores com rendimentos.
  - O botão "Buscar endereço" preenche o endereço pela API ViaCEP.
  - O CPF é validado pelos dígitos verificadores, a senha precisa ter ao menos 6 caracteres, e e-mail e CPF não podem repetir.
  - Ao concluir, o cliente já entra logado.

## Cliente

**HU05 — Login**
Como cliente, quero fazer login para acessar meus pedidos.
- Critérios de aceitação:
  - Sem login de cliente, as telas de pedido e de cadastro redirecionam para o login.
  - Credenciais inválidas mostram uma mensagem de erro.
  - Agentes que entram pelo mesmo login são levados ao painel do agente.

**HU06 — Criar pedido**
Como cliente, quero escolher sábado e domingo e ver a previsão do tempo antes de confirmar o pedido.
- Critérios de aceitação:
  - O seletor oferece apenas os próximos 6 fins de semana (retirada no sábado e devolução no domingo).
  - A previsão de Belo Horizonte vem da API Open-Meteo, para os próximos 16 dias; para conversíveis aparece uma dica sobre a capota.
  - Um carro já reservado no mesmo fim de semana não pode ser pedido de novo.
  - O pedido nasce com status `pendente`, valor de 2 diárias e histórico.

**HU07 — Acompanhar status**
Como cliente, quero acompanhar o status do meu pedido para saber se foi aprovado.
- Critérios de aceitação:
  - A lista "Meus pedidos" mostra o status com cor e texto, as datas, o valor e o local de retirada.
  - Cada pedido tem um histórico de mudanças de status com data, hora e o parecer do agente, quando houver.

**HU08 — Modificar e cancelar pedido**
Como cliente, quero modificar ou cancelar um pedido que ainda não virou contrato.
- Critérios de aceitação:
  - O fim de semana só pode ser alterado enquanto o pedido estiver `pendente` ou `em análise`.
  - O cancelamento vale para pedidos `pendente`, `em análise` ou `aprovado` e pede confirmação.
  - Pedidos com contrato executado, recusados ou cancelados não podem ser alterados nem cancelados.

**HU09 — Gerenciar cadastro**
Como cliente, quero consultar, alterar e excluir meu cadastro (CRUD de cliente).
- Critérios de aceitação:
  - Todas as operações usam os verbos REST do JSON Server (GET, POST, PATCH e DELETE).
  - A exclusão pede confirmação e é bloqueada se houver pedidos ativos.

## Agente (empresa ou banco)

**HU10 — Avaliar pedidos**
Como agente, quero ver os pedidos pendentes junto com a renda do cliente para avaliar o risco financeiro.
- Critérios de aceitação:
  - O painel tem abas com a contagem de pedidos: novos, em análise, aprovados e contratos.
  - Cada pedido mostra o cliente, a profissão, a renda mensal somada e o número de empregadores.
  - O agente assume um pedido pendente; só ele passa a poder avaliá-lo.
  - Aprovar ou recusar atualiza o status, aceita um parecer opcional e registra tudo no histórico.

**HU11 — Modificar pedido**
Como agente, quero modificar um pedido para ajustar o fim de semana ou o valor antes do contrato.
- Critérios de aceitação:
  - A modificação vale para pedidos `em análise` sob a responsabilidade do agente.
  - O fim de semana respeita as mesmas regras e o mesmo bloqueio de conflito do cliente.
  - A modificação fica registrada no histórico.

**HU12 — Executar contrato**
Como agente, quero executar o contrato de um pedido aprovado para formalizar o aluguel.
- Critérios de aceitação:
  - Só o agente responsável executa o contrato de um pedido `aprovado`.
  - O contrato registra o pedido, o agente, a data e o tipo (`aluguel`), e o pedido passa a `contrato executado`.
  - O proprietário do automóvel (cliente, empresa ou banco) fica registrado no próprio automóvel.

**HU13 — Conceder crédito**
Como banco, quero vincular um contrato de crédito a um contrato de aluguel já executado para financiar o aluguel.
- Critérios de aceitação:
  - A aba "Crédito a conceder" aparece só para bancos e lista contratos executados sem crédito.
  - O contrato de crédito guarda valor, parcelas (de 1 a 48) e taxa (de 0% a 20% ao mês), e o painel calcula a parcela.
  - O contrato passa a ser do tipo "aluguel com crédito" e fica ligado ao banco que o concedeu.
