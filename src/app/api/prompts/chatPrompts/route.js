import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimitError = 
        error.message?.includes('429') || 
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.message?.includes('quota');

      if (isRateLimitError && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        console.log(`Rate limit hit, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request) {
  try {
    const { messages, chatId, userId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Allow both authenticated users and guests
    // Guests will have userId: 'guest'

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // FIXED: Generate title only if this is the first USER message
    let title = null;
    const userMessages = messages.filter(msg => msg.role === 'user');
    
    if (userMessages.length === 1) {
      const firstUserMessage = userMessages[0].content;
      const titlePrompt = `Generate a very short, descriptive title (2-4 words max) for an art discussion that starts with this message: "${firstUserMessage}". 
      The title should be concise and relevant to the art topic being discussed. 
      Respond with ONLY the title, no extra text, quotes, or punctuation at the end.`;

      try {
        const titleResult = await model.generateContent(titlePrompt);
        const titleResponse = await titleResult.response;
        title = titleResponse.text().trim().replace(/['"]/g, ''); // Remove quotes if any
        console.log('✅ Generated title:', title); // Debug log
      } catch (titleError) {
        console.error('Error generating title:', titleError);
        // Continue without title if generation fails
      }
    }

    // Create system prompt for the AI assistant
    const systemPrompt = `You are a creative and enthusiastic drawing prompt assistant for DoodleBuddy. Your role is to:

1. Help users brainstorm drawing ideas based on their interests
2. Provide specific, detailed drawing prompts when requested
3. Suggest techniques, styles, or themes to explore
4. Be encouraging and supportive of their artistic journey
5. Keep responses concise (2-4 sentences) unless the user asks for more detail
6. When generating prompts, be specific with visual details, mood, composition, and style

Always be friendly, creative, and focus on visual art and drawing. If users ask about non-drawing topics, gently redirect them back to art-related discussions.

Example responses:
- User: "I want to draw something fantasy"
  Assistant: "How about drawing a mystical forest guardian - a deer with glowing antlers standing in a moonlit clearing, surrounded by floating orbs of light and ancient runes carved into the trees? You could use soft blues and purples for the magical atmosphere!"

- User: "Give me a character idea"
  Assistant: "Try sketching a steampunk inventor with goggles perched on their forehead, wild hair full of pencils and tools, and mechanical wings folded behind them. Add details like brass gears, leather straps, and blueprints tucked in their vest pockets!"`;

    // Format conversation history for Gemini
    const conversationHistory = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

    // Generate response
     const result = await retryWithBackoff(async () => {
      return await model.generateContent(fullPrompt);
    });
    const response = await result.response;
    const aiMessage = response.text().trim();

    // Return the AI response with title
    return NextResponse.json({ 
      message: aiMessage,
      chatId: chatId,
      title: title // Will be null if not first message
    });
  } catch (error) {
    console.error('Error in chat prompts:', error);

    // Check for specific API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API key configuration error. Please check your Gemini API key.' },
        { status: 500 }
      );
    }

    if (error.message?.includes('quota') || 
        error.message?.includes('limit') || 
        error.message?.includes('429') ||
        error.message?.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json(
        { error: 'API usage limit reached. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    if (error.message?.includes('safety')) {
      return NextResponse.json(
        { error: 'Your message was flagged by content filters. Please rephrase and try again.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response. Please try again.' },
      { status: 500 }
    );
  }
}