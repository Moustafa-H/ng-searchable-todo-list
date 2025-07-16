import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService)
    
    return authService.user.pipe(
        take(1),
        exhaustMap((user) => {
            if (!user || !user.token)
                return next(req)

            const modifiedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            
            return next(modifiedReq)
        })
    )
}