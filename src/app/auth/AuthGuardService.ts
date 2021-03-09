import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {}

    canActivate(): Observable<boolean> {
        return this.auth.isAuthenticated();
    }
}
