# Histórias do Usuário — WeekndCar

## Visitante

**HU01 — Filtrar catálogo**
Como visitante, quero filtrar os carros por categoria (muscle car, esportivo europeu, conversível) para encontrar o que combina com o meu fim de semana.
- Critérios de aceitação:
  - O catálogo é carregado do JSON Server via Fetch API.
  - Os filtros atualizam a lista sem recarregar a página.
  - Cada card mostra foto, marca, modelo, ano e diária.

**HU02 — Ver detalhes do carro**
Como visitante, quero ver os detalhes de um carro para decidir se vale a pena alugá-lo.
- Critérios de aceitação:
  - A página mostra matrícula, ano, marca, modelo e placa.
  - Um resumo da história do modelo é buscado na API da Wikipedia.

**HU03 — Cadastrar-se**
Como visitante, quero me cadastrar informando o CEP para que o endereço seja preenchido automaticamente.
- Critérios de aceitação:
  - Campos: RG, CPF, nome, endereço, profissão e até 3 empregadores com rendimentos.
  - O endereço é preenchido pela API ViaCEP.
  - CPF e e-mail são validados antes de salvar no JSON Server.

## Cliente

**HU04 — Login**
Como cliente, quero fazer login para acessar meus pedidos.
- Critérios de aceitação:
  - Sem login, as telas de pedido ficam bloqueadas.
  - Credenciais inválidas mostram uma mensagem de erro.

**HU05 — Criar pedido**
Como cliente, quero escolher sábado e domingo e ver a previsão do tempo antes de confirmar o pedido.
- Critérios de aceitação:
  - O seletor de datas aceita apenas fim de semana.
  - A previsão de Belo Horizonte vem da API Open-Meteo.
  - O pedido é criado com status `pendente`.

**HU06 — Acompanhar status**
Como cliente, quero acompanhar o status do meu pedido para saber se foi aprovado.
- Critérios de aceitação:
  - A lista de pedidos mostra o status com cor e ícone.
  - A tela de detalhe mostra o histórico de mudanças de status.

**HU07 — Modificar e cancelar pedido**
Como cliente, quero modificar ou cancelar um pedido que ainda não virou contrato.
- Critérios de aceitação:
  - Pedidos com contrato executado não podem ser alterados nem cancelados.
  - O cancelamento pede confirmação.

**HU08 — Gerenciar cadastro**
Como cliente, quero consultar, alterar e excluir meu cadastro (CRUD de cliente).
- Critérios de aceitação:
  - Todas as operações usam os verbos REST do JSON Server (GET, POST, PUT/PATCH, DELETE).

## Agente (empresa ou banco)

**HU09 — Avaliar pedidos**
Como agente, quero ver os pedidos pendentes junto com os rendimentos do cliente para avaliar o risco financeiro.
- Critérios de aceitação:
  - A lista mostra apenas pedidos `pendente` ou `em análise`.
  - Aprovar ou recusar atualiza o status e registra o agente responsável.

**HU10 — Modificar pedido**
Como agente, quero modificar um pedido para ajustar valores ou condições antes do contrato.

**HU11 — Executar contrato**
Como agente, quero executar o contrato de um pedido aprovado para formalizar o aluguel.
- Critérios de aceitação:
  - O contrato registra o tipo de propriedade do automóvel (cliente, empresa ou banco).

**HU12 — Conceder crédito**
Como banco, quero vincular um contrato de crédito a um pedido aprovado para financiar o aluguel.
- Critérios de aceitação:
  - O contrato de crédito guarda valor, parcelas e taxa e fica ligado ao banco que o concedeu.
