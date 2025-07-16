import { Component, inject, signal } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { finalize } from "rxjs/operators";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './auth.Component.html',
})
export class AuthComponent {
    router = inject(Router)
    authService = inject(AuthService)
    hidePwd = signal(true)
    isLoading = false
    
    clickEvent(ev: MouseEvent) {
        this.hidePwd.set(!this.hidePwd())
        ev.stopPropagation()
    }

    handleLogin(ev: NgForm) {
        if (!ev.valid)
            return
        
        const email = ev.value.email
        const password = ev.value.password
        this.isLoading = true
        this.authService.login(email, password)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (resData) => {
                    this.router.navigate(['/todos'])
                },
                error: (errorMessage) => {
                    alert(errorMessage)
                },
            })
    }
}