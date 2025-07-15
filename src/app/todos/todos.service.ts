import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable } from "@angular/core";
import { Todo, TodosResponse } from "./todos.model";

@Injectable({
    providedIn: 'root'
})
export class TodosService {
    private httpClient = inject(HttpClient)
    private destroyRef = inject(DestroyRef)
    loading = false
  
    isLoading() {
        return this.loading
    }

    private sortTodos(todos: Todo[]) {
        todos.sort((a, b) => a.priority - b.priority)
    }

    fetchTodos(): Todo[] {
        this.loading = true
        const todos: Todo[] = []
        const subscription = this.httpClient
            .get<{ documents: TodosResponse[] }>('https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos')
            .subscribe({
                next: (resData) => {
                    for (const data of resData.documents) {
                        const idArr = data.name.split('/')
                        const id = idArr[idArr.length - 1]
                    
                        todos.push({
                            id: id,
                            text: data.fields.text.stringValue,
                            priority: parseInt(data.fields.priority.stringValue),
                            status: data.fields.status.stringValue
                        })
                    }
    
                    this.sortTodos(todos)
                },
                error: () => {
                    alert('There was an error in your last request, please try again later.')
                },
                complete: () => {
                    this.loading = false
                },
            })
        
        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe()
        })

        return todos
    }

    addTodo(todos: Todo[], fields: TodosResponse['fields']) {
        const subscription = this.httpClient
            .post<TodosResponse>(
                'https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos',
                JSON.stringify({ fields }),
                { headers: { 'Content-Type': 'application/json' } }
            )
            .subscribe({
                next: (resData) => {
                    const idArr = resData.name.split('/')
                    const id = idArr[idArr.length - 1]
                    todos.push({
                        id: id,
                        text: resData.fields.text.stringValue,
                        priority: parseInt(resData.fields.priority.stringValue),
                        status: resData.fields.status.stringValue
                    })
                    this.sortTodos(todos)
                },
                error: () => {
                    alert('There was an error in your last request, please try again later.')
                    window.location.reload()
                },
            })
            
        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe()
        })
    }

    updateTodoStatus(id: string, newStatus: TodosResponse['fields']['status']['stringValue']) {
        const subscription = this.httpClient
            .patch<TodosResponse>(
                `https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos/${id}?updateMask.fieldPaths=status`,
                JSON.stringify({ fields: { status: { stringValue: newStatus } } }),
                { headers: { 'Content-Type': 'application/json' } }
            )
            .subscribe({
                error: () => {
                    alert('There was an error in your last request, please try again later.')
                    window.location.reload()
                }
            })

        this.destroyRef.onDestroy(() => {
            subscription.unsubscribe()
        })
    }
}