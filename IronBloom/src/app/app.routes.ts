import { Routes } from '@angular/router';
import { RecipeLibrary } from './recipe-library/recipe-library';
import { Home } from './home/home';
import { RecipeDetails } from './recipe-details/recipe-details';
import { CoachChat } from './coach-chat/coach-chat';
import { Tracker } from './tracker/tracker';

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
      path: 'coach', 
      component: CoachChat
    },  
    {
    path: 'tracker',
    component: Tracker
    },
    {
    path: '**',
    redirectTo: ''
    }
];
