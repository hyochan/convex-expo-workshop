import {internalAction} from './_generated/server';
import {internal} from './_generated/api';
import {v} from 'convex/values';

export const fetchAndInsertAiMessage = internalAction({
  args: v.object({
    author: v.id('users'),
  }),
  handler: async (ctx, {author}) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key is not set in environment variables.');
    }

    const systemPrompt =
      'You are an assistant that generates random questions about the Convex framework and answers them concisely. Do not use prefixes like "Question:" or "Answer:" in your response.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {role: 'system', content: systemPrompt},
          {
            role: 'user',
            content: 'Generate a random question about Convex and answer it.',
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('Failed to retrieve a valid response from OpenAI.');
    }

    const [question, ...answerParts] = assistantMessage.split('\n');

    await ctx.runMutation(internal.messages.insertAiMessage, {
      author,
      message: question,
      reply: answerParts.join('\n').trim(),
    });

    return {question, answer: answerParts};
  },
});
