import { Request, Response } from 'express';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// GitHub AI inference configuration using same setup as mobile chat
const token = process.env.GITHUB_TOKEN || '';
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

// Only initialize client if token is available
let client: any = null;
if (token) {
  client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );
}

// Nedaxer knowledge base for crypto trading assistance
const NEDAXER_KNOWLEDGE = `
Nedaxer is a comprehensive cryptocurrency trading platform offering:

TRADING FEATURES:
- Spot Trading: Buy and sell cryptocurrencies at current market prices
- Futures Trading: Leveraged trading with position management
- Real-time market data and charts for 100+ cryptocurrencies
- Order types: Market orders, limit orders
- Live price updates every 10 seconds

FUNDING & DEPOSITS:
- Deposit cryptocurrencies using generated wallet addresses
- Support for multiple networks: Ethereum Network, BEP-20 (Binance Smart Chain)
- Popular cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), USDT, and more
- Real-time balance updates after deposits
- QR codes provided for easy mobile deposits

ACCOUNT FEATURES:
- Portfolio tracking and performance analytics
- Transfer funds between users via email or UID
- Withdrawal system with crypto gateways
- Staking rewards and earning opportunities
- 24/7 customer support via chat bot

SECURITY:
- Regulated exchange with robust customer protections
- Email verification required for account activation
- KYC verification system for enhanced security
- Admin-controlled access restrictions

I can help with trading strategies, market analysis, platform navigation, and general crypto knowledge.
`;

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If no client available, return fallback response
    if (!client) {
      return res.json({ 
        response: "I'm sorry, the chat service is temporarily unavailable. Please contact our support team directly for assistance with your trading questions."
      });
    }

    // Build conversation context
    const contextMessages = [
      {
        role: 'system',
        content: `You are Nedaxer Chat Bot, a helpful cryptocurrency trading assistant for Nedaxer trading platform.

IMPORTANT INSTRUCTIONS:
- Be professional, helpful, and concise
- Focus on cryptocurrency trading, market analysis, and Nedaxer platform features
- Keep responses conversational and friendly
- For complex trading questions, provide clear explanations
- If you don't know something specific, admit it and suggest contacting support

NEDAXER PLATFORM KNOWLEDGE:
${NEDAXER_KNOWLEDGE}

Respond as a knowledgeable crypto trading assistant helping users with their questions.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    const response = await client.path("/chat/completions").post({
      body: {
        messages: contextMessages,
        temperature: 0.7,
        top_p: 1,
        model: model,
        max_tokens: 400
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const responseContent = response.body.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.";

    res.json({ response: responseContent });

  } catch (error) {
    console.error('Chat API error:', error);
    res.json({
      response: 'I\'m experiencing some technical difficulties. Please try again later.'
    });
  }
}