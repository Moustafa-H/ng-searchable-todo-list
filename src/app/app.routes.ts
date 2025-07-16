import { Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { PageNotFoundComponent } from "./pageNotFound.component";

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
    },
    {
        path: 'todos',
        loadComponent: () => import('./todos/todos.component').then(mod => mod.TodosComponent),
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    }
]