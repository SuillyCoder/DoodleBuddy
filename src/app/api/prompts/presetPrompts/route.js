import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { theme } = await request.json();

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a prompt for Gemini
    const prompt = `Generate a creative and specific drawing prompt for the theme: ${theme}. 
    
The prompt should be:
- Simple and easy to work with.
- Keep the vocabulary simple.
- Include specific elements, mood, or style suggestions
- Be between 10-15 words
- Be suitable for artists of all levels
- Focus on visual elements
- Keep the prompt to a single statement if possible
- Make all the prompts start with "Draw a / an..."

Just provide the drawing prompt text without any additional explanation or formatting.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedPrompt = response.text().trim();

    return NextResponse.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Error generating preset prompt:', error);
    
    // Check for specific API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'API key configuration error. Please check your Gemini API key.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate prompt. Please try again.' },
      { status: 500 }
    );
  }
}