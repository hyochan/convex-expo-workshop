import {openAiKey} from '../../config';

const chatHistories = [
  {
    role: 'system',
    content:
      'You are an expert in the Convex framework, specializing in its use with Expo. Your job is to provide professional answers to any questions related to Convex.',
  },
];

export async function sendMessage(message: string): Promise<string> {
  try {
    chatHistories.push({role: 'user', content: message});

    console.log('chatHistories:', chatHistories);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: chatHistories,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message;

    chatHistories.push(assistantMessage);
    return assistantMessage.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to connect to OpenAI');
  }
}
