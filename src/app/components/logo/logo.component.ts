import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import CircleType from 'circletype';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],

  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit {
  public titleElement: any;

  ngOnInit(): void {
    // this.titleElement = new CircleType(document.getElementById('title'));
    // let radius = 10000;
    // this.titleElement.radius(radius);
  }
}
