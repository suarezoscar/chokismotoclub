import { Injectable, inject, signal } from '@angular/core';
import { Auth, user, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private toastService = inject(ToastService);

  user$ = user(this.auth);
  currentUser = signal<User | null>(null);

  constructor() {
    this.user$.subscribe(u => this.currentUser.set(u));
  }

  /**
   * Checks if the given email has a document in the `admins` collection.
   * Each admin has their email as the document ID.
   */
  async checkIsAdmin(email: string): Promise<boolean> {
    try {
      const snap = await getDoc(doc(this.firestore, 'admins', email));
      return snap.exists();
    } catch (e) {
      return false;
    }
  }

  loginWithGoogle(): Observable<void> {
    return from(new Promise<void>(async (resolve, reject) => {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(this.auth, provider);

        const isAdmin = await this.checkIsAdmin(result.user.email!);

        if (!isAdmin) {
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

