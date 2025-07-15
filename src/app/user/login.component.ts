import { Component, inject, signal } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
    templateUrl: './login.Component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    hide = signal(true)
    
    clickEvent(event: MouseEvent) {
        this.hide.set(!this.hide())
        event.stopPropagation()
    }

    router = inject(Router)

    username = ''
    password = ''

    handleLogin(ev: NgForm) {
        if (this.username && this.password) {
            console.log(this.username, this.password)
        }

        this.router.navigate(['/todos'])
    }
}