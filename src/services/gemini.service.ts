import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize Gemini with the API key from environment
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateRomanticMessage(recipientName: string, relationship: string, tone: string): Promise<string> {
    if (!process.env['API_KEY']) {
      return "Happy Birthday! (Please configure API_KEY to generate custom messages)";
    }

    try {
      const prompt = `Write a short, deeply romantic and poetic birthday letter for ${recipientName}. 
      Relationship context: ${relationship}. 
      Tone: ${tone}. 
      Maximum 4 sentences. 
      Do not include the "Dear [Name]" or signature parts, just the body text. 
      Make it sound timeless and elegant.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "May your day be filled with love and light.";
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "Every moment with you is a treasure. Happy Birthday to my one and only.";
    }
  }
}