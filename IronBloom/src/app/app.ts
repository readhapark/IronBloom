import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet,RouterModule } from '@angular/router';
import { Tracker } from './tracker/tracker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,Tracker,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('IronBloom');
}
