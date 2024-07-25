import Groq from 'groq-sdk';

import { log } from '../logger';
import { storage } from '../storage';

export function getGroq() {
  const apiKey = storage.getString('aiKey');
  console.log('apiKey', apiKey);
  return new Groq({ apiKey });
}

type ChatHistory = {
  messages: { role: string; content: string }[];
};

class GroqService {
  private model: string;
  private systemPrompt = `
    You are an expert-level personal assistant. 
    The user is going to provide with their entire chat history with you, along with their latest message and \n
    you are going to respond to the user based on the chat history.
  `;

  constructor({ model }: { model: string }) {
    this.model = model;
  }

  async chat({ chatHistory, message }: { chatHistory: ChatHistory; message: string }) {
    const groq = getGroq();
    log('Chatting with Groq', { chatHistory, message });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: `\n
          CHAT HISTORY:\n${chatHistory.messages.map((message) => `${message.role}: ${message.content}`).join('\n')}\n\n
          LATEST_MESSAGE: ${message}`,
        },
      ],
      model: this.model,
    });
    log('Chat completion', { chatCompletion });
    return chatCompletion.choices[0]?.message?.content || '';
  }
}

export const groqService = new GroqService({ model: 'llama3-8b-8192' });
