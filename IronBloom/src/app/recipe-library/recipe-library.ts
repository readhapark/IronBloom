import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Recipe {
  id: number;
  name: string;
  category: string;
  ingredients: string[];
  iron_mg: number;
  dietary_preferences: string[];
  allergies: string[];
  prep_time_minutes: number;
  cook_time_minutes: number;
  instructions: string; 
}


@Component({
  selector: 'app-recipe-library',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recipe-library.html',
  styleUrl: './recipe-library.css',
})
export class RecipeLibrary implements OnInit {
  recipes: Recipe[] = [];
  searchTerm = '';
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .get<{ recipes: Recipe[] }>('assets/recipes.json')
      .subscribe({
        next: (data) => {
          this.recipes = data?.recipes ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading recipes.json', err);
          this.errorMessage = 'Unable to load recipes right now.';
          this.isLoading = false;
        }
      });
  }

  get filteredRecipes(): Recipe[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.recipes;
    }

    return this.recipes.filter((recipe) => {
      const inName = recipe.name.toLowerCase().includes(term);
      const inCategory = recipe.category.toLowerCase().includes(term);
      const inIngredients = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(term)
      );
      return inName || inCategory || inIngredients;
    });
  }

}
