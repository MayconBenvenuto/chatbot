# Açougue do Benício - Bot do WhatsApp

Este projeto é um bot para WhatsApp desenvolvido utilizando a biblioteca `whatsapp-web.js`. O bot simula um serviço de açougue, permitindo aos usuários consultar e comprar produtos via mensagens.

## Funcionalidades

- **Autenticação via QR Code**: O bot gera um QR Code para autenticação do WhatsApp.
- **Interação com o Usuário**: O bot responde a mensagens e guia o usuário através do processo de compra.
- **Gerenciamento de Carrinho**: Permite aos usuários adicionar produtos ao carrinho e visualizar o total.
- **Processamento de Pagamento**: O bot oferece opções de pagamento e confirma a compra.

## Estrutura do Projeto

- `index.js`: Arquivo principal que configura e executa o bot.
- `produtos.js`: Módulo contendo a lista de produtos disponíveis no açougue.
- `package.json`: Arquivo de configuração do projeto com dependências e scripts.

## Documentação do Código

O código está documentado utilizando JSDoc para facilitar a compreensão e manutenção. Abaixo estão algumas das funções e suas descrições:

- **`handleIncomingMessage(message)`**: Processa mensagens recebidas e direciona para o estado adequado.
- **`handleInitialState(message, text, userId)`**: Lida com o estado inicial e inicia a interação com o usuário.
- **`sendInitialGreeting(message)`**: Envia a mensagem de boas-vindas e opções de menu.
- **`handleMenuSelection(message, text, userId)`**: Processa a seleção do menu e exibe as opções de produtos.
- **`displayMenu(message, category, userId)`**: Exibe o menu de produtos para a categoria selecionada.
- **`handleProductSelection(message, text, userId, categoryState)`**: Adiciona produtos ao carrinho com base na seleção do usuário.
- **`addToCart(userId, product)`**: Adiciona um produto ao carrinho do usuário.
- **`viewCart(message, userId)`**: Exibe o conteúdo do carrinho e o total.
- **`handleCartOption(message, text, userId)`**: Processa as opções do carrinho, como pagamento ou adicionar mais produtos.
- **`handlePayment(message, text, userId)`**: Processa o pagamento e finaliza a compra.
- **`resetUserState(userId)`**: Reseta o estado do usuário para o estado inicial.
- **`capitalizeFirstLetter(string)`**: Capitaliza a primeira letra de uma string.
