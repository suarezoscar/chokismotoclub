import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private allowedEmails: string[] = [];

  /** Emits true once the allowlist has been fetched from Firestore */
  readonly emailsReady$ = new BehaviorSubject<boolean>(false);

  user$ = user(this.auth);
  currentUser = signal<User | null>(null);

  constructor() {
    this.user$.subscribe(u => this.currentUser.set(u));
    this.loadAllowedEmails();
  }

  private async loadAllowedEmails(): Promise<void> {
    try {
      const snap = await getDocs(collection(this.firestore, 'admin_emails'));
      const emails: string[] = [];
      snap.forEach(d => {
        const data = d.data();
        if (Array.isArray(data['emails'])) {
          emails.push(...data['emails']);
        }
      });
      this.allowedEmails = emails;
    } catch (e) {
      console.error('Error loading admin emails', e);
    } finally {
      this.emailsReady$.next(true);
    }
  }

  isAllowed(email: string | null | undefined): boolean {
    return !!email && this.allowedEmails.includes(email);
  }

  loginWithGoogle(): Observable<void> {
    return from(new Promise<void>(async (resolve, reject) => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);

        if (!this.isAllowed(result.user.email)) {
          await signOut(this.auth);
          this.toastService.show('Acceso no autorizado', 'error');
          reject(new Error('unauthorized'));
          return;
        }

        this.toastService.show('Inicio de sesión correcto', 'success');
        this.router.navigate(['/admin']);
        resolve();
      } catch (error: any) {
        if (error?.message !== 'unauthorized') {
          console.error('Login failed', error);
          this.toastService.show('Error al iniciar sesión', 'error');
        }
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
