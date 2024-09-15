import {OpenAI} from "openai";
import { OpenAIFunctionsObject } from "./tool_helper";



export class BankingFunctions implements OpenAIFunctionsObject {
    constructor(private contaCorrente: ContaCorrente, private boletos:Boleto[], private contaFavoritas: ContaCorrente[]) {
    }


    boletosPendentes() {
        return "Boletos Pendentes:\n" + 
            this.boletos.filter(boleto => boleto.statusBoleto === "Pendente")
                            .reduce((acc, boleto) => acc + boleto.toString() + "\n", "");
    }

    pagarBoleto(numeroBoleto: number) {
        const boleto = this.boletos.find(boleto => boleto.numero === numeroBoleto);
        if (boleto) {
            if (boleto.statusBoleto === "Pago") {
                return "Boleto já foi pago!";
            } else {
                boleto.pagar(this.contaCorrente);
                return "Boleto pago com sucesso!";
            }
        } else {
            return "Boleto não encontrado!";
        }
    }

    transferir(valor: number, numeroContaDestino: number) {
        const contaDestino = this.contaFavoritas.find(conta => conta.numeroConta === numeroContaDestino);
        if (contaDestino) {
            this.contaCorrente.transferir(valor, contaDestino);
            return "Transferência realizada com sucesso!";
        } else {
            return "Conta destino não encontrada!";
        }
    }

    saldo() {
        return this.contaCorrente.saldo + "";
    }

    obterNumeroContaPorApelido(apelido: string) {
        const conta = this.contaFavoritas.find(conta => conta.apelido === apelido);
        if (conta) {
            return conta.numeroConta + "";
        } else {
            return "Conta não encontrada!";
        }
    }

    getTools(): Array<OpenAI.ChatCompletionTool> {
        return [
            {
                "type": "function",
                "function": {
                    "name": "boletosPendentes",
                    "description": "Retorna os boletos pendentes para essa conta",
                    "parameters": {
                        "type": "object",
                        "properties": {

                        },
                        "additionalProperties": false,
                    },
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "pagarBoleto",
                    "description": "Paga um boleto",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "numeroBoleto": {
                                "type": "number",
                                "description": "Número do boleto a ser pago",
                            },
                        },
                        "required": ["numeroBoleto"],
                        "additionalProperties": false,
                    },
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "transferir",
                    "description": "Transfere um valor para uma conta favorita",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "valor": {
                                "type": "number",
                                "description": "Valor a ser transferido",
                            },
                            "numeroContaDestino": {
                                "type": "number",
                                "description": "Número da conta destino",
                            },
                        },
                        "required": ["valor", "numeroContaDestino"],
                        "additionalProperties": false,
                    },
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "saldo",
                    "description": "Retorna o saldo da conta corrente",
                    "parameters": {
                        "type": "object",
                        "properties": {

                        },
                        "additionalProperties": false,
                    },
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "obterNumeroContaPorApelido",
                    "description": "Retorna o número da conta por apelido",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "apelido": {
                                "type": "string",
                                "description": "Apelido da conta",
                            },
                        },
                        "required": ["apelido"],
                        "additionalProperties": false,
                    },
                }
            }
        ]
    }
}


export class ContaCorrente {

    constructor(public saldo: number, public numeroConta: number, public apelido: string) {
        
    }

    depositar(valor: number) {
        this.saldo += valor;
    }

    sacar(valor: number) {
        this.saldo -= valor;
    }

    transferir(valor: number, contaDestino: ContaCorrente) {
        this.sacar(valor);
        contaDestino.depositar(valor);
    }

    toString() {
        return `Conta ${this.apelido} - Número: ${this.numeroConta} - Saldo: ${this.saldo}`;
    }


}

export class Boleto {

    constructor(public numero: number, public valor: number,  public sacado: string, public statusBoleto: "Pendente" | "Pago" = "Pendente") {
   }

    pagar(contaCorrente: ContaCorrente) {
        contaCorrente.sacar(this.valor);
        this.statusBoleto = "Pago";
    }

    toString() {
        return `Boleto de R$ ${this.valor}\nNúmero: ${this.numero}\nSacado: ${this.sacado}\nStatus: ${this.statusBoleto}`;
    }

}