import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showTopBar = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Only handle top bar visibility
    const scrollPosition = window.scrollY;
    this.showTopBar = scrollPosition > window.innerHeight * 0.15;
  }
}
