# Diagrama de Casos de Uso — WeekndCar

Sistema de aluguel de carros clássicos e emblemáticos para o fim de semana, com sede em Belo Horizonte.

## Atores

| Ator | Descrição |
|------|-----------|
| Visitante | Usuário sem cadastro; só consulta o catálogo e pode se cadastrar |
| Cliente | Usuário cadastrado que cria e acompanha pedidos de aluguel |
| Agente | Empresa ou banco que avalia e modifica pedidos |
| Banco | Especialização de Agente; também concede contratos de crédito |

## Diagrama

```mermaid
flowchart LR
    V([Visitante])
    C([Cliente])
    A([Agente])
    B([Banco])

    subgraph S["Sistema WeekndCar"]
        UC1(Consultar catálogo)
        UC2(Filtrar por categoria)
        UC3(Ver detalhes do carro)
        UC4(Cadastrar-se)
        UC5(Fazer login)
        UC6(Gerenciar cadastro)
        UC7(Criar pedido de aluguel)
        UC8(Modificar pedido)
        UC9(Consultar status do pedido)
        UC10(Cancelar pedido)
        UC11(Avaliar pedido financeiramente)
        UC12(Executar contrato)
        UC13(Conceder contrato de crédito)
    end

    V --- UC1
    V --- UC2
    V --- UC3
    V --- UC4
    C -->|herda| V
    C --- UC5
    C --- UC6
    C --- UC7
    C --- UC8
    C --- UC9
    C --- UC10
    A --- UC5
    A --- UC8
    A --- UC11
    A --- UC12
    B -->|herda| A
    B --- UC13
```

## Descrição resumida

| Caso de uso | Ator | Pré-condição | Resultado |
|-------------|------|--------------|-----------|
| Cadastrar-se | Visitante | — | Cliente criado no JSON Server (endereço via ViaCEP) |
| Fazer login | Cliente, Agente | Cadastro existente | Sessão iniciada |
| Criar pedido de aluguel | Cliente | Logado | Pedido com status `pendente` |
| Modificar pedido | Cliente, Agente | Pedido não contratado | Pedido atualizado |
| Cancelar pedido | Cliente | Pedido sem contrato executado | Status `cancelado` |
| Avaliar pedido financeiramente | Agente | Pedido `pendente` ou `em análise` | Status `aprovado` ou `recusado` |
| Executar contrato | Agente | Pedido `aprovado` | Contrato criado, status `contrato executado` |
| Conceder contrato de crédito | Banco | Pedido `aprovado` | Contrato de crédito vinculado ao contrato |
