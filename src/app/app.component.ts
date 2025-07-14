import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Todo, TodosResponse } from './todos.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  priorities: {[key: number]: string} = {
    1: 'Very High',
    2: 'High',
    3: 'Normal',
    4: 'Optional'
  }

  todos: Todo[] = []

  prioritySelect = 3
  search = ''

  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    const subscription = this.httpClient
      .get<{ documents: TodosResponse[] }>('https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos')
      .subscribe({
        next: (resData) => {
          for (const data of resData.documents) {
            const idArr = data.name.split('/')
            const id = idArr[idArr.length - 1]
            
            this.todos.push({
              id: id,
              text: data.fields.text.stringValue,
              priority: parseInt(data.fields.priority.stringValue),
              status: data.fields.status.stringValue
            })
          }

          this.sortTodos()
        }
      })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }

  get pendingTodos() {
    return this.todos.filter(t => t.text.includes(this.search)).filter(t => t.status === 'pending');
  }

  get completedTodos() {
    return this.todos.filter(t => t.text.includes(this.search)).filter(t => t.status === 'completed');
  }

  sortTodos() {
    this.todos.sort((a, b) => a.priority - b.priority)
  }

  handleAddTodo(ev: NgForm) {
    const todo = ev.form.value.todo
    const priority = ev.form.value.priority
    if (todo) {
      const fields = {
        text: { stringValue: todo },
        priority: { stringValue: priority.toString() },
        status: { stringValue: 'pending' }
      }

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
            this.todos.push({
              id: id,
              text: todo,
              priority: priority,
              status: 'pending'
            })

            this.sortTodos()
          }
        })
      
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe()
      })
    }
  }

  handleSearchTodos(ev: NgForm) {
    const query = ev.form.value.query
    this.search = query
  }

  handleSearchTodosReset() {
    this.search = ''
  }

  dragstartHandler(ev: DragEvent) {
    ev.dataTransfer?.setData("id", (ev.target as HTMLElement).id);
  }

  dragoverHandler(ev: DragEvent) {
    ev.preventDefault();
  }

  dropHandler(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData("id");
    const todo = this.todos.find(s => s.id == data)
    const newStatus = (ev.currentTarget as HTMLElement).id == 'pendList' ? 'pending' : 'completed'
    if (todo) {
      todo.status = newStatus

      const fields = { status: { stringValue: newStatus } }

      const subscription = this.httpClient
        .patch<TodosResponse>(
          `https://firestore.googleapis.com/v1/projects/searchable-todo-list/databases/(default)/documents/todos/${data}?updateMask.fieldPaths=status`,
          JSON.stringify({ fields }),
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
}
