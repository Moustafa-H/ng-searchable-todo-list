import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { LoginResponse, User, UserType } from "../models/auth.model";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    httpClient = inject(HttpClient)
    destroyRef = inject(DestroyRef)
    user = new BehaviorSubject<User | null>(null)
    private tokenExpirationTimer: any
    private router = inject(Router)

    autoLogin() {
        const userDataString = localStorage.getItem('userData')
        if (!userDataString)
            return

        const userData: UserType = JSON.parse(userDataString)
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )

        if (loadedUser.token) {
            this.user.next(loadedUser)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(expirationDuration)
        }
    }

    login(email: string, password: string) {
        return this.httpClient.post<LoginResponse>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
            JSON.stringify({
                email,
                password,
                returnSecureToken: true
            }),
            { headers: { 'Content-Type': 'application/json' } }
        ).pipe(
            catchError((errorRes) => {
                let errorMessage = "An error occured, please try again later."
                
                if (!errorRes.error || !errorRes.error.error)
                    return throwError(() => new Error(errorMessage))

                switch (errorRes.error.error.message) {
                    case 'INVALID_EMAIL':
                        errorMessage = "Invalid email entered"
                        break
                    case 'INVALID_LOGIN_CREDENTIALS':
                        errorMessage = "Incorrect email or password."
                }

                return throwError(() => new Error(errorMessage))
            }),
            tap((resData) => {
                const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
                const user = new User(resData.email, resData.localId, resData.idToken, expirationDate)
                this.user.next(user)
                this.autoLogout(+resData.expiresIn * 1000)
                localStorage.setItem('userData', JSON.stringify(user))
            })
        )
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    logout() {
        this.user.next(null)
        localStorage.removeItem('userData')
        if (this.tokenExpirationTimer)
            clearTimeout(this.tokenExpirationTimer)
        this.tokenExpirationTimer = null
        this.router.navigate(['/'])
    }
}