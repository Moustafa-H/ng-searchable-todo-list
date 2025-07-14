import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Todo } from './todos/todos.model';
import { TodosService } from './todos/todos.service';

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

  search = ''
  todos: Todo[] = []
  prioritySelect = 3
  private todosService = inject(TodosService)

  ngOnInit() {
    this.todos = this.todosService.fetchTodos()
  }

  get pendingTodos() {
    return this.todos.filter(t => t.text.includes(this.search)).filter(t => t.status === 'pending')
  }

  get completedTodos() {
    return this.todos.filter(t => t.text.includes(this.search)).filter(t => t.status === 'completed')
  }

  handleAddTodo(ev: NgForm) {
    const todo = ev.form.value.todo
    const priority = ev.form.value.priority
    
    if (todo) {
      this.todosService.addTodo(this.todos, {
        text: { stringValue: todo },
        priority: { stringValue: priority.toString() },
        status: { stringValue: 'pending' }
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
    if (data && todo) {
      todo.status = newStatus
      this.todosService.updateTodoStatus(data, newStatus)
    }
  }
}
