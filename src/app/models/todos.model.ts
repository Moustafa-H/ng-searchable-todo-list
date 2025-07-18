export type Todo = {
  id: string
  text: string
  priority: number
  status: 'pending' | 'completed'
}

export type TodosResponseFields = {
  text: { stringValue: string }
  priority: { stringValue: string }
  status: { stringValue: 'pending' | 'completed' }
}

export interface TodosResponse {
    name: string
    fields: TodosResponseFields
}