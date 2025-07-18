import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Todo } from "../models/todos.model";
import { TodosService } from "../services/todos.service";

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
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
    return this.todos.filter(t => t.text.toLowerCase().includes(this.search)).filter(t => t.status === 'pending')
  }

  get completedTodos() {
    return this.todos.filter(t => t.text.toLowerCase().includes(this.search)).filter(t => t.status === 'completed')
  }

  get loading() {
    return this.todosService.isLoading()
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

    ev.controls['todo'].reset();
  }

  handleSearchTodos(ev: NgForm) {
    const query = ev.form.value.query
    this.search = query.toLowerCase()
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