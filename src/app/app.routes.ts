import { Routes } from "@angular/router";
import { LoginComponent } from "./user/login.component";
import { PageNotFoundComponent } from "./pageNotFound.component";

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
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