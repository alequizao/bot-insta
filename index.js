const Insta = require('@androz2091/insta.js');
const axios = require('axios');

const client = new Insta.Client();
let meuId;

client.on('connected', () => {
  console.log(`Conectado como ${client.user.username}!`);
  meuId = client.user.id;
  console.log(`ID do bot: ${meuId}`);
});

client.on('messageCreate', async (message) => {
  if (message.authorId !== meuId && message.authorId !== client.user.id) {
    // Verifica se a mensagem é recebida (mensagem de outro usuário)

    let response;
    const mensagemEmMinusculo = message.content.toLowerCase(); // Padroniza a mensagem em minúsculas

    if (mensagemEmMinusculo.startsWith('gpt')) {
      // Se a mensagem começar com "gpt", adiciona a mensagem ao prompt
      const prompt = encodeURIComponent(message.content);
      const url = `https://gptfree.appgps.com.br/prompt=${prompt}`;
      
      try {
        const jsonResponse = await obterRespostaDoGPT(url);
        response = jsonResponse.answer; // Extrai a resposta da chave "answer" do JSON
      } catch (error) {
        console.error('Erro ao consultar a API:', error);
      }
    } else {
      // Se a mensagem não for "gpt", use a própria mensagem como prompt
      try {
        const jsonResponse = await obterRespostaDoGPT(message.content);
        response = jsonResponse.answer; // Extrai a resposta da chave "answer" do JSON
      } catch (error) {
        console.error('Erro ao consultar a API:', error);
      }
    }

    if (response) {
      message.reply(response);
    }
  } else {
    // Ignora mensagens enviadas pelo próprio bot
    console.log('Mensagem ignorada.');
  }
});

async function obterRespostaDoGPT(url) {
  const response = await axios.get(url);
  return response.data; // Retorna o JSON completo
}

client.login('SEU-INSTA', 'SUA-SENHA');
// Mantém o código em execução até ser explicitamente encerrado
process.stdin.resume();
