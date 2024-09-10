const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const produtos = require('./produtos.js');  // Importando o arquivo de produtos

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    webCache: false  // Desativa o cache local
});

const userStates = {};
const cart = {};
const CONTACT_NUMBERS = {
    //BRENO: '558192708196@c.us',
    ZELTSER: '5581999711117@c.us',
    //UEIBE: '558181427917@c.us',
    //BELA: '558184119649@c.us',
    //JACK: '558184636954@c.us'
};


client.on('qr', (qr) => {
    qrcode.generate(qr,{small:true});
    console.log('Escaneie o QR Code acima para autenticar seu WhatsApp.');
});

client.on('ready', () => {
    console.log('Bot está pronto e conectado!');
});

client.on('message', message => {
    const from = message.from;
    
    // Agora o bot responde a todos os contatos
    handleIncomingMessage(message); 

    // Se você ainda quiser manter logs sobre mensagens de contatos específicos
    if (Object.values(CONTACT_NUMBERS).includes(from)) {
        console.log(`Mensagem de um contato conhecido: ${from}`);
    } else {
        console.log(`Mensagem de um contato desconhecido: ${from}`);
    }
});

function handleIncomingMessage(message) {
    try {
        const userId = message.from;
        const text = message.body.toLowerCase();
        const state = userStates[userId] || 'initial';

        console.log(`Estado atual do usuário ${userId}: ${state}`);
        console.log(`Mensagem recebida: ${text}`);

        switch (state) {
            case 'initial':
                handleInitialState(message, text, userId);
                break;
            case 'greeted':
                handleMenuSelection(message, text, userId);
                break;
            case 'choosing_suinas':
            case 'choosing_bovinas':
            case 'choosing_peixes':
                handleProductSelection(message, text, userId, state);
                break;
            case 'viewingCart':
                handleCartOption(message, text, userId);
                break;
            case 'payment':
                handlePayment(message, text, userId);
                break;
            default:
                message.reply('Desculpe, não entendi. Por favor, digite "ajuda" para obter orientações.');
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        message.reply('Ocorreu um erro ao processar sua mensagem. Tente novamente.');
    }
}

function handleInitialState(message, text, userId) {
    if (text === 'oi'||'bom dia'||'boa tarde') {
        userStates[userId] = 'greeted';
        sendInitialGreeting(message);
    } else {
        //message.reply('Por favor, diga "oi" para começar.');
        sendInitialGreeting(message)
    }
}

function sendInitialGreeting(message) {
    const welcomeMessage = `🥩 *Bem-vindo ao Açougue do Benício!* 🥩
Por favor, escolha uma das opções abaixo:

1. Carnes Suínas
2. Carnes Bovinas
3. Peixes

Digite o número correspondente à sua escolha e nós estaremos prontos para atendê-lo! 🛒`;
    message.reply(welcomeMessage);
}

function handleMenuSelection(message, text, userId) {
    switch (text) {
        case '1':
            displayMenu(message, 'suinas', userId);
            break;
        case '2':
            displayMenu(message, 'bovinas', userId);
            break;
        case '3':
            displayMenu(message, 'peixes', userId);
            break;
        case 'ver carrinho':
            viewCart(message, userId);
            break;
        default:
            message.reply('Opção inválida. Por favor, digite o número correspondente à sua escolha ou "ver carrinho" para consultar seu carrinho.');
    }
}

function displayMenu(message, category, userId) {
    let menu = `*${capitalizeFirstLetter(category)}:* \n`;
    produtos[category].forEach(produto => {
        menu += `${produto.id}. ${produto.nome}: R$ ${produto.preco.toFixed(2)}/kg\n`;
    });
    message.reply(menu);
    userStates[userId] = `choosing_${category}`;
}

function handleProductSelection(message, text, userId, categoryState) {
    const category = categoryState.split('_')[1];
    const selectedProduct = produtos[category].find(produto => produto.id == text);

    if (selectedProduct) {
        addToCart(userId, selectedProduct);
        message.reply(`Você adicionou ${selectedProduct.nome} ao seu carrinho por R$ ${selectedProduct.preco.toFixed(2)}. Deseja continuar comprando?\n\nDigite "sim" para continuar ou "ver carrinho" para ver seu carrinho.`);
        userStates[userId] = 'viewingCart';
    } else {
        message.reply('Opção inválida. Por favor, escolha um número válido.');
    }
}

function addToCart(userId, product) {
    if (!cart[userId]) {
        cart[userId] = [];
    }
    cart[userId].push(product);
}

function viewCart(message, userId) {
    if (!cart[userId] || cart[userId].length === 0) {
        message.reply('Seu carrinho está vazio.');
        return;
    }

    let cartMessage = 'Seu carrinho contém:\n';
    let total = 0;

    cart[userId].forEach((item, index) => {
        cartMessage += `${index + 1}. ${item.nome}: R$ ${item.preco.toFixed(2)}\n`;
        total += item.preco;
    });

    cartMessage += `Total: R$ ${total.toFixed(2)}\n\nDigite "pagar" para prosseguir para o pagamento ou "adicionar mais" para adicionar mais produtos.`;
    message.reply(cartMessage);
    userStates[userId] = 'viewingCart';
}

function handleCartOption(message, text, userId) {
    const normalizedText = text.trim().toLowerCase();
    
    switch (normalizedText) {
        case 'pagar':
            message.reply('Qual forma de pagamento?\n1. Pix\n2. Crédito/Débito');
            userStates[userId] = 'payment';
            break;
        case 'adicionar mais':
        case 'sim':  
            userStates[userId] = 'greeted';
            sendInitialGreeting(message);
            break;
        default:
            message.reply('Resposta inválida. Digite "pagar" para prosseguir para o pagamento, ou "adicionar mais" para adicionar mais produtos.');
    }
}

function handlePayment(message, text, userId) {
    const normalizedText = text.trim().toLowerCase();
    
    if (normalizedText === '1') {
        message.reply('Você escolheu pagamento por Pix. Obrigado pela sua compra!');
        resetUserState(userId);
    } else if (normalizedText === '2') {
        message.reply('Você escolheu pagamento por Crédito/Débito. Obrigado pela sua compra!');
        resetUserState(userId);
    } else {
        message.reply('Forma de pagamento inválida. Digite "1" para Pix ou "2" para Crédito/Débito.');
    }
}

function resetUserState(userId) {
    userStates[userId] = 'initial';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

client.initialize();
