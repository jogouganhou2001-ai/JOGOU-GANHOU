import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPrizeDream = async (amount: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      O valor atual do prêmio de um sorteio é R$ ${amount.toFixed(2)}.
      Crie uma frase curta, animada e motivadora (máximo 15 palavras) sobre o que a pessoa poderia fazer com esse dinheiro no Brasil.
      Exemplo: "Garanta o churrasco do fim de semana com a galera!"
      Não use aspas na resposta.
      Seja criativo e varie as sugestões (pagar contas, viajar, lazer, compras).
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating prize dream:", error);
    return "Realize seus sonhos com esse prêmio extra!";
  }
};

export const getTransparencyExplanation = async (): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Escreva um parágrafo curto (máximo 30 palavras) explicando de forma muito simples e transparente para um usuário leigo como funciona a divisão do dinheiro em um sorteio honesto (70% prêmio, 30% taxas). Transmita confiança.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "Garantimos que 70% de todo valor arrecadado vai direto para o prêmio. Transparência total no seu app.";
  }
};

export const getReportSummary = async (month: string, collected: number, paid: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analise estes dados de um sorteio transparente em ${month}:
      Arrecadado: R$ ${collected}
      Pago em Prêmios: R$ ${paid}
      Gere um resumo executivo de 1 frase (max 20 palavras) confirmando que a meta de 70% de retorno aos jogadores foi cumprida (ou superada). Tom profissional e transparente.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    return `Em ${month}, R$ ${paid.toFixed(2)} foram distribuídos aos ganhadores.`;
  }
};