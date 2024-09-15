import 'dotenv/config'
import { AzureOpenAI } from "openai";


const openai = new AzureOpenAI({
    apiVersion: process.env.AZURE_OPENAI_VERSION,
    baseURL: process.env.AZURE_OPENAI_API_BASE,
    apiKey: process.env.AZURE_OPENAI_API_KEY
});

const model = "gpt-4o";

(async () => {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "Olá, tudo bem?" }],
        model: model
    });
    console.log(chatCompletion.choices[0].message.content);
})();

