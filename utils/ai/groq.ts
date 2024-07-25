import Groq from 'groq-sdk';

import { storage } from '../storage';

export function getGroq() {
  return new Groq({ apiKey: storage.getString('aiKey') });
}

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || '');
}

const systemPrompt = `
  You are an expert-level personal assistant. 
  The user is going to provide with their entire chat history with you, along with their latest message and \n
  you are going to respond to the user based on the chat history.
`;

export async function getGroqChatCompletion() {
  const groq = getGroq();
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: 'Explain the importance of fast language models',
      },
    ],
    model: 'llama3-8b-8192',
  });
}

type ChatHistory = {
  messages: { role: string; content: string }[];
};

export async function respond(chatHistory: ChatHistory, latestMessage: string) {
  const groq = getGroq();
  return groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `\n
        CHAT HISTORY:\n${chatHistory.messages.map((message) => `${message.role}: ${message.content}`).join('\n')}\n\n
        LATEST_MESSAGE: ${latestMessage}`,
      },
    ],
    model: 'llama3-8b-8192',
  });
}
