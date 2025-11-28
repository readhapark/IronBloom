import { Routes } from '@angular/router';
import { RecipeLibrary } from './recipe-library/recipe-library';
import { Home } from './home/home';

export const routes: Routes = [
    {
    path: '',
    component: Home
    },
    {
    path: 'recipes',
    component: RecipeLibrary
    },
    {
    path: '**',
    redirectTo: ''
  }
];
