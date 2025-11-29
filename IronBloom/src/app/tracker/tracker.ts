import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Food {
  name: string;
  iron: number; // mg per serving
}

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.html',
  styleUrls: ['./tracker.css'],
})
export class Tracker {
  foods: Food[] = [
    { name: 'Spinach', iron: 2.7 },
    { name: 'Lentils', iron: 3.3 },
    { name: 'Tofu', iron: 5.4 },
    { name: 'Chicken', iron: 1.3 },
    { name: 'Broccoli', iron: 0.7 }
  ];
  selectedFood: Food | null = null;
  selectedFoods: Food[] = [];

  addFood() {
    if (this.selectedFood) {
      this.selectedFoods.push(this.selectedFood);
      this.selectedFood = null;
    }
  }

  totalIron(): number {
    return this.selectedFoods.reduce((sum, food) => sum + food.iron, 0);
  }
}
