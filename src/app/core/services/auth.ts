import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError, from, Observable, tap } from 'rxjs';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Expose user as a signal or observable
  user$ = user(this.auth);
  currentUser = signal<User | null>(null);

  constructor() {
    // Sync signal with observable
    this.user$.subscribe(u => this.currentUser.set(u));
  }

  loginWithGoogle(): Observable<void> {
    return from(new Promise<void>(async (resolve, reject) => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(this.auth, provider);
        this.toastService.show('Inicio de sesión correcto', 'success');
        this.router.navigate(['/admin']);
        resolve();
      } catch (error) {
        console.error('Login failed', error);
        this.toastService.show('Error al iniciar sesión', 'error');
        reject(error);
      }
    }));
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
