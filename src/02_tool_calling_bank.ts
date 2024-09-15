import 'dotenv/config'
import { AzureOpenAI } from "openai";
import { OpenAI } from "openai";
import { BankingFunctions, ContaCorrente, Boleto } from './tool_calling/banking';  
import { OpenAIFunctionsHelper } from './tool_calling/tool_helper';


const openai = new AzureOpenAI({
    apiVersion: process.env.AZURE_OPENAI_VERSION,
    baseURL: process.env.AZURE_OPENAI_API_BASE,
    apiKey: process.env.AZURE_OPENAI_API_KEY
});

const model = "gpt-4o";

function buildMessage(role:string, content: string) {
    return {role, content};
}


const contaCorrente = new ContaCorrente(1000, 123456, "Conta Corrente");
const boletos = [new Boleto(123, 100, "Academia", "Pendente"), new Boleto(124, 200, "Condomínio", "Pendente"), new Boleto(125, 1200, "Escola", "Pendente")];
const contaFavoritas = [new ContaCorrente(0, 123456, "João"), new ContaCorrente(0, 123457, "André")];
const bankingFunctions = new BankingFunctions(contaCorrente, boletos, contaFavoritas);


(async () => {
    const messages = await OpenAIFunctionsHelper.toolLoops(openai, model, [
        OpenAIFunctionsHelper.buildMessage("system", "Voce é um assistente bancário que ajuda um cliente a transacionar em usa conta. Seja solicito e educado."),
        OpenAIFunctionsHelper.buildMessage("user", "Pague todos os boletos que não estouram o saldo e tranfira 200 para o João. Depois me diga o saldo final."),
    ], bankingFunctions);
    console.dir(messages, {depth: null});
})();

