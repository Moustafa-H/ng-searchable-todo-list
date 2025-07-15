import { Routes } from "@angular/router";
import { LoginComponent } from "./user/login.component";
import { TodosComponent } from "./todos/todos.component";
import { PageNotFoundComponent } from "./pageNotFound.component";

export const routes: Routes = [
    {
        path: '',
        component: TodosComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
]