import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public title = signal('CHOKIS MOTOCLUB');
  public location = signal('O Carballiño · Galicia');
  public subtitle = signal('Club motero desde 2023 · #xentedebarra');
}
