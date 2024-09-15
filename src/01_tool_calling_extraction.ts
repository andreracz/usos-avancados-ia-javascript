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

const tools: Array<OpenAI.ChatCompletionTool> = [
    {
        "type": "function",
        "function": {
            "name": "contact-information-extraction",
            "description": "report the contact information extracted from the text",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "name extracted from the text",
                    },
                    "email": {
                        "type": "string",
                        "description": "email extracted from the text",
                    },
                    "phone": {
                        "type": "string",
                        "description": "phone extracted from the text",
                    },
                    

                },
                "required": ["name"],
                "additionalProperties": false,
            },
        }
    }
] 


async function extracaoDeInformacoes(texto: string, print: boolean) {
    const systemPrompt = "Você é um assistente para extrair informações de um texto.";

    const chatCompletion = await openai.chat.completions.create({
        messages: [
            buildMessage("system", systemPrompt),
            buildMessage("user", texto),
        ],
        model: model,
        tools: tools
    });
    const extracted = [];
    if (print) {
        console.dir(chatCompletion.choices[0].message, {depth: null});
    }
    chatCompletion.choices[0].message.tool_calls.forEach((tool_call) => { 
        extracted.push(JSON.parse(tool_call.function.arguments));
    });
    return extracted;
}



(async () => {
    
    console.log(await extracaoDeInformacoes("Meu nome é João, meu email é joao@contoso.com e meu telefone é 1234567890", true));
    console.log(await extracaoDeInformacoes("Meu nome é João, meu email é joao@contoso.com", false));
    console.log(await extracaoDeInformacoes("Meu nome é Maria, meu email é maria@contoso.com e meu telefone é 1234567890.\nMeu nome é João, meu email é joao@contoso.com e meu telefone é 1234567890", false));
})();

