import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

type ChatRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: ChatRole;
  content: string;
  createdAt: Date;
}


@Component({
  selector: 'app-coach-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './coach-chat.html',
  styleUrl: './coach-chat.css',
})
export class CoachChat {
  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content:
        'Hi, I’m your iron-aware coach. Ask me anything about iron intake, your recipes, or how to combine foods for better absorption.',
      createdAt: new Date()
    }
  ];

  userInput = '';
  isSending = false;
  errorMessage = '';

  // TODO: change this to your real backend URL or relative API route
  private apiUrl = 'https://your-api-url.example.com/chat';

  // Optional: “system prompt” you send with each request
  private ironFactsContext = `
You are an iron-aware nutrition assistant for an app called IronBloom.
You ONLY answer questions about iron, related nutrition, and the user’s recipes.
If a question is unrelated to iron or nutrition, gently steer them back.

High-level facts about iron:
- Heme iron (from animal sources like beef, chicken, fish) is more easily absorbed.
- Non-heme iron (from plant sources like lentils, spinach, chickpeas) is less easily absorbed.
- Vitamin C (like citrus, bell peppers) helps increase non-heme iron absorption.
- Tea and coffee with meals can reduce iron absorption.
- Balance iron intake across the day rather than in one huge meal.

You also know this recipe list (examples):
1. Spinach Chickpea Curry – vegan, 4.2 mg iron.
2. Beef and Broccoli Stir Fry – meat, 2.8 mg iron, contains soy.
3. Lentil Soup – vegetarian, 6.6 mg iron.

Always be safe and conservative: you are NOT a doctor and you cannot diagnose or prescribe.
Encourage users to talk to a healthcare professional for medical concerns.
  `.trim();

  constructor(private http: HttpClient) {}

  async sendMessage(): Promise<void> {
    const question = this.userInput.trim();
    if (!question || this.isSending) {
      return;
    }

    this.errorMessage = '';
    this.isSending = true;

    // Add the user message to the chat
    const userMsg: ChatMessage = {
      role: 'user',
      content: question,
      createdAt: new Date()
    };
    this.messages = [...this.messages, userMsg];
    this.userInput = '';

    try {
      // Payload shape is just an example – match whatever your backend expects
      const body = {
        systemPrompt: this.ironFactsContext,
        messages: this.messages.map((m) => ({
          role: m.role,
          content: m.content
        }))
      };

      const response = await this.http
        .post<{ reply: string }>(this.apiUrl, body)
        .toPromise();

      const replyText =
        response?.reply ??
        "I'm having trouble reaching the AI right now, but generally: focus on consistent iron-rich meals and pairing plant iron with vitamin C.";

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: replyText,
        createdAt: new Date()
      };

      this.messages = [...this.messages, assistantMsg];
    } catch (err) {
      console.error('Error calling coach API', err);
      this.errorMessage =
        'I could not reach the iron coach service. Showing a fallback response.';

      const fallbackMsg: ChatMessage = {
        role: 'assistant',
        content:
          "I'm offline right now, but as a general tip: try including at least one iron-rich food in each meal, and pair plant-based iron (like spinach, lentils, chickpeas) with vitamin C (like lemon, bell peppers, oranges) to boost absorption.",
        createdAt: new Date()
      };
      this.messages = [...this.messages, fallbackMsg];
    } finally {
      this.isSending = false;
    }
  }

}
