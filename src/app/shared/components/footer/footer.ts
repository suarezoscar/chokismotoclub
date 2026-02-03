import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  private router = inject(Router);
  currentYear = signal(new Date().getFullYear());

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
