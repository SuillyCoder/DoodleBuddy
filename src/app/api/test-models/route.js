import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not found' }, { status: 500 });
    }

    // List all available models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        error: errorData,
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter to only show models that support generateContent
    const contentModels = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];

    return NextResponse.json({
      totalModels: data.models?.length || 0,
      contentGenerationModels: contentModels.length,
      availableModels: contentModels.map(m => ({
        name: m.name,
        displayName: m.displayName,
        version: m.version,
        description: m.description,
        supportedMethods: m.supportedGenerationMethods
      }))
    });
  } catch (error) {
    console.error('Error listing models:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}