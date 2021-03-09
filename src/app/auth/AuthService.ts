import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    public isAuthenticated(): Observable<boolean> {
        return this.httpClient
            .get(environment.apiUrl + 'user/authorization', {
                observe: 'response',
                headers:{'authorization': localStorage.getItem('authorization')}
            })
            .pipe(
                map((res) => {
                    if (res.status === 200) {
                        return true;
                    } else {
                        return false;
                    }
                })
            );
    }
}
