import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { switchMap, take } from 'rxjs/operators';
import { from } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        switchMap(user => {
            if (!user?.email) {
                return from(Promise.resolve(router.createUrlTree(['/login'])));
            }
            return from(
                authService.checkIsAdmin(user.email).then(isAdmin =>
                    isAdmin ? true : router.createUrlTree(['/login'])
                )
            );
        })
    );
};
