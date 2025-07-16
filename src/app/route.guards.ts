import { inject } from "@angular/core";
import { CanMatchFn, RedirectCommand, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { map, take } from "rxjs/operators";

export const authCanMatch: CanMatchFn = (route, segments) => {
    const authService = inject(AuthService)
    const router = inject(Router)
    
    return authService.user.pipe(
        take(1),
        map((user) => {
            if (!user)
                return true
            else
                return new RedirectCommand(router.parseUrl('/todos'))
        })
    )
}

export const todosCanMatch: CanMatchFn = (route, segments) => {
    const authService = inject(AuthService)
    const router = inject(Router)
    
    return authService.user.pipe(
        take(1),
        map((user) => {
            if (user)
                return true
            else
                return new RedirectCommand(router.parseUrl('/'))
        })
    )
}