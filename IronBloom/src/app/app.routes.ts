import { Routes } from '@angular/router';
<<<<<<< HEAD
import { RecipeLibrary } from './recipe-library/recipe-library';
import { Home } from './home/home';
import { RecipeDetails } from './recipe-details/recipe-details';

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
      path: 'recipes/:id', 
      component: RecipeDetails },
    {
    path: '**',
    redirectTo: ''
=======
import { Tracker } from './tracker/tracker';

export const routes: Routes = [
    {
        path: 'tracker',
        component: Tracker
>>>>>>> efaf990 (fix)
    }
];
