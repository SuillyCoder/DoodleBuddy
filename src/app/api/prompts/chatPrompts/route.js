import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create system prompt for the AI assistant
    const systemPrompt = `You are a creative and enthusiastic drawing prompt assistant for DoodleBuddy. Your role is to:

1. Help users brainstorm drawing ideas based on their interests
2. Provide specific, detailed drawing prompts when requested
3. Suggest techniques, styles, or themes to explore
4. Be encouraging and supportive of their artistic journey
5. Keep responses concise (2-4 sentences) unless the user asks for more detail

Always be friendly, creative, and focus on visual art and drawing. If users ask about non-drawing topics, gently redirect them back to art-related discussions.`;

    // Format conversation history for Gemini
    const conversationHistory = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiMessage = response.text().trim();

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('Error in chat prompts:', error);

    // Check for specific API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API key configuration error. Please check your Gemini API key.' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json(
        { error: 'API usage limit reached. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response. Please try again.' },
      { status: 500 }
    );
  }
}