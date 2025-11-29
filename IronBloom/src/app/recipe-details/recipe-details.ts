import { Component, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css',
})
export class RecipeDetails implements OnInit{
  recipe: Recipe | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (Number.isNaN(id)) {
      this.errorMessage = 'Invalid recipe id.';
      return;
    }

    this.loadRecipe(id);
  }

  loadRecipe(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<{ recipes: Recipe[] }>('assets/recipes.json').subscribe({
      next: (data) => {
        const recipes = data?.recipes ?? [];
        const found = recipes.find((r) => r.id === id) ?? null;
        this.recipe = found;
        if (!found) {
          this.errorMessage = 'Recipe not found.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipes.json', err);
        this.errorMessage = 'Unable to load this recipe right now.';
        this.isLoading = false;
      }
    });
  }

  goBackToLibrary(): void {
    this.router.navigate(['/recipes']);
  }

  get totalTime(): number | null {
    if (!this.recipe) return null;
    return (
      this.recipe.prep_time_minutes + this.recipe.cook_time_minutes
    );
  }

}
