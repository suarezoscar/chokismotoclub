import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],

  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {}
