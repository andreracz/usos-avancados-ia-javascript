import 'dotenv/config'
import { AzureOpenAI } from "openai";
import { OpenAI } from "openai";


const openai = new AzureOpenAI({
    apiVersion: process.env.AZURE_OPENAI_VERSION,
    baseURL: process.env.AZURE_OPENAI_API_BASE,
    apiKey: process.env.AZURE_OPENAI_API_KEY
});

const model = "gpt-4o";

function buildMessage(role:"system" | "user" | "assistant", content: string) {
    return {role, content};
}

function buildMultiModalMessage(role:"user" , content: string, imageUrl: string): OpenAI.ChatCompletionUserMessageParam {
    return {role, content: [{ type: "text", "text": content }, { type: "image_url", "image_url": { "url": imageUrl} }]};
}


async function executaMultimodal(texto: string, image_url: string) {
    const systemPrompt = "Você é um assistente virtual. Você está aqui para ajudar as pessoas com suas dúvidas e perguntas.";
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        buildMessage("system", systemPrompt),
        buildMultiModalMessage("user", texto, image_url),

    ];

    const chatCompletion = await openai.chat.completions.create({
        messages: messages,
        model: model
    });
    return chatCompletion.choices[0].message.content;
}



(async () => {
    
    console.log(await executaMultimodal("Com base na imagem, sugira outros locais para visita na mesma cidade", "https://jpimg.com.br/uploads/2023/05/turismo-no-rio-de-janeiro-veja-o-que-visitar-na-cidade-maravilhosa.jpg"));
    console.log(await executaMultimodal("Com base na imagem, quantos carboidratos tem?", "https://www.saborbrasil.it/wp-content/uploads/2021/06/pag.181_01_feijoada-1024x768.jpg"));


})();

