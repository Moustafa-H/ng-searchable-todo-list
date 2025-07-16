import { Routes } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { PageNotFoundComponent } from "./pageNotFound.component";
import { authCanMatch, todosCanMatch } from "./route.guards";

export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        canActivate: [authCanMatch],
    },
    {
        path: 'todos',
        loadComponent: () => import('./todos/todos.component').then(mod => mod.TodosComponent),
        canActivate: [todosCanMatch],
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    }
]