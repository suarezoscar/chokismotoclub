import { Component } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent, RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
