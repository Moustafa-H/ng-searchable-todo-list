import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { LoginResponse } from "../models/auth.model";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    httpClient = inject(HttpClient)
    destroyRef = inject(DestroyRef)

    login(email: string, password: string) {
        return this.httpClient.post<LoginResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
            JSON.stringify({
                email,
                password,
                returnSecureToken: true
            }),
            { headers: { 'Content-Type': 'application/json' } }
        ).pipe(catchError((errorRes) => {
            let errorMessage = "An error occured, please try again later."
            
            if (!errorRes.error || !errorRes.error.error)
                return throwError(() => new Error(errorMessage))

            switch (errorRes.error.error.message) {
                case 'INVALID_EMAIL':
                    errorMessage = "Invalid email entered"
                    break
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = "Wrong email or password."
            }

            return throwError(() => new Error(errorMessage))
        }))
    }
}