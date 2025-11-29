
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type ChatRole = 'user' | 'assistant';

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
  styleUrl: './coach-chat.css'
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

  // This is just a local “knowledge prompt” we’ll use to build responses.
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

You are NOT a doctor and you cannot diagnose or prescribe.
Encourage users to talk to a healthcare professional for medical concerns.
  `.trim();

  async sendMessage(): Promise<void> {
    const question = this.userInput.trim();
    if (!question || this.isSending) {
      return;
    }

    this.errorMessage = '';
    this.isSending = true;

    // Add the user message
    const userMsg: ChatMessage = {
      role: 'user',
      content: question,
      createdAt: new Date()
    };
    this.messages = [...this.messages, userMsg];
    this.userInput = '';

    // Simulate “thinking”
    setTimeout(() => {
      const replyText = this.buildLocalReply(question);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: replyText,
        createdAt: new Date()
      };

      this.messages = [...this.messages, assistantMsg];
      this.isSending = false;
    }, 600); // 0.6s fake delay
  }

  // Local AI pattern-based responses using iron facts.
  private buildLocalReply(question: string): string {
    const q = question.toLowerCase();

    // Redirect if totally off-topic
    if (!q.includes('iron') && !q.includes('recipe') && !q.includes('lentil') &&
        !q.includes('spinach') && !q.includes('chickpea') && !q.includes('beef') &&
        !q.includes('broccoli') && !q.includes('soup') && !q.includes('curry')) {
      return (
        "I’m here specifically to help with iron-focused nutrition. " +
        "Try asking about iron-rich meals, your recipes (like Spinach Chickpea Curry or Lentil Soup), " +
        "or how to pair foods to improve iron absorption."
      );
    }

    // Some simple tailored replies
    if (q.includes('breakfast')) {
      return (
        "For an iron-friendly breakfast, you could adapt the Lentil Soup or include leftovers from an iron-rich dinner. " +
        "Pair plant-based iron (like lentils or spinach) with vitamin C (like orange slices, strawberries, or bell peppers) " +
        "to boost absorption. Avoid tea or coffee right with the meal if iron is a concern."
      );
    }

    if (q.includes('spinach') || q.includes('chickpea') || q.includes('curry')) {
      return (
        "Spinach Chickpea Curry is a great non-heme iron option (about 4.2 mg iron in your recipe list). " +
        "Find the recipe in our recipe library! To get the most from it, serve it with a vitamin C source—like a squeeze of lemon, a side of bell peppers, " +
        "or a small citrus salad. That combination helps your body absorb more of the iron from the curry."
      );
    }

    if (q.includes('lentil')) {
      return (
        "Your Lentil Soup is one of the higher-iron recipes (about 6.6 mg iron). " +
        "It’s plant-based, so the iron is non-heme. Adding tomatoes, lemon juice, or a side of fruit can boost absorption. " +
        "You can also batch-cook it and eat it as a light lunch or dinner across the week to keep your intake steady."
      );
    }

    if (q.includes('beef') || q.includes('broccoli')) {
      return (
        "Beef and Broccoli Stir Fry gives you heme iron from the beef plus some non-heme from the broccoli. " +
        "Heme iron is absorbed more easily, which is helpful if you’re low on iron. " +
        "Just be mindful that the recipe lists soy sauce, so it contains soy—important if you have soy allergies."
      );
    }

    if (q.includes('vitamin c') || q.includes('absorb')) {
      return (
        "Vitamin C is one of the best ways to support iron absorption, especially from plant-based foods. " +
        "Try to pair iron-rich dishes like Spinach Chickpea Curry or Lentil Soup with citrus, bell peppers, or tomatoes. " +
        "Avoid drinking tea or coffee right with the meal, as they can reduce absorption."
      );
    }

    if (q.includes('deficiency') || q.includes('anemia') || q.includes('anaemia')) {
      return (
        "If you suspect iron deficiency or anemia, it’s really important to talk to a healthcare professional. " +
        "I can help you think about iron-rich meals—like lentils, spinach, chickpeas, or lean meats—but I can’t diagnose, " +
        "interpret lab results, or recommend supplements."
      );
    }

    // General fallback guidance
    return (
      "Great question. In general, try to:\n" +
      "• Include at least one iron-rich food in each meal (lentils, spinach, chickpeas, beef, etc.).\n" +
      "• Pair plant-based iron with vitamin C (citrus, bell peppers, tomatoes) for better absorption.\n" +
      "• Avoid tea or coffee right with iron-heavy meals, as they can reduce absorption.\n" +
      "If you tell me which recipe you’re planning to use (Spinach Chickpea Curry, Beef and Broccoli Stir Fry, or Lentil Soup), " +
      "I can suggest how to fit it into your day."
    );
  }
}
