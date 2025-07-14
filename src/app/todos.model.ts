export type Todo = {
  id: string
  text: string
  priority: number
  status: 'pending' | 'completed'
}

export interface TodosResponse {
    'documents': {
        'name': string
        'fields': {
            'text': { 'stringValue': string }
            'priority': { 'stringValue': string }
            'status': { 'stringValue': 'pending' | 'completed' }
        }
    }[]
}