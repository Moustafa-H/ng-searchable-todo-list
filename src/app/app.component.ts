import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styles: '.selected { color: brown; }',
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService)
  private userSub: Subscription | undefined
  isAuthenticated = false

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user
    })

    this.authService.autoLogin()
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe()
  }

  handleLogout() {
    this.authService.logout()
  }
}
