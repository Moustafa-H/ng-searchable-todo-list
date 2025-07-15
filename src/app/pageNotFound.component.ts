import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-pageNotFound',
    standalone: true,
    imports: [RouterLink],
    template: '<h1>404 Page Not Found</h1><br><a routerLink="/">return to home</a>'
})
export class PageNotFoundComponent {}