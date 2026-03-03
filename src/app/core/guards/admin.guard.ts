import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { filter, switchMap, map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Wait for the Firestore allowlist to be loaded, then check the user
    return authService.emailsReady$.pipe(
        filter(ready => ready),
        take(1),
        switchMap(() => authService.user$.pipe(take(1))),
        map(user => {
            if (user && authService.isAllowed(user.email)) {
                return true;
            }
            return router.createUrlTree(['/login']);
        })
    );
};
