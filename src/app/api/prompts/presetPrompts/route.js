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
    const prompt = `Your perpetual task is to provide drawing prompts to a user who is currently looking to 
    draw something related to the given theme: ${theme}. 
    

When generating a prompt, please take note of the following parameters: :
- Simple and easy to work with.
- Keep the vocabulary simple.
- Include specific elements, mood, or style suggestions
- Be between 10-15 words
- Be suitable for artists of all levels
- Focus on visual elements
- Keep the prompt to a single statement if possible

Additionallyl, whenever the user requests a prompt under the same theme, PLEASE REFRAIN
from using the same subject from the previous prompt, but with some small modifications. 

Ex. 1st prompt: "Draw a mermaid in a beautiful seashell dress"
    2nd prompt: "Draw a mermaid sitting on a rock". <-- This is NOT acceptable.

Ex. 1st prompt: "Draw a mermaid with a bunch of sea creatures surrounding her"
    2nd prompt: "Draw an elf residing in a nearby inn drinking beer." <-- This is acceptable.

This is because of the explicit difference in subjects. Please take note of this difference. 
It should !!STRICTLY!! be noted that this difference should be observed for every 3 prompts after a certain subject
has been generated.

Ex: When "mermaid" has been used in a prompt, the next 3 prompts should NOT contain "mermaid" as a subject 
!! PLEASE STRICTLY FOLLOW THIS !! 

It should also be noted that the prompt should be CONSISTENT all throughout the given theme. 

Ex: "A mermaid swimming through the ocean with a trident". <-- This is acceptable for the "Fantasy" theme given its coherent theme and setting.
Ex: "A mermaid with a trident in the forest fighting goblins with swords" <-- This is NOT acceptable for the "Fantasy" theme as it mixes different settings and themes.

Finally, please provide the prompt in the following format:

"Draw an " + the specific subject / scenario in accordance with the chosen theme. 

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