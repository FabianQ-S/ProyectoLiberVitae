export interface KeyConcept {
  name: string
  tooltip: string
}

export interface LearningStep {
  step: number
  title: string
  completed: boolean
}

export interface Resources {
  documentation: string
  video: string
  additional: string
}

export interface NodeData {
  label: string
  description?: string
  detailedDescription?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  type: 'required' | 'optional' | 'phase'
  status: 'pending' | 'in-progress' | 'completed' | 'skipped'
  isPrincipal?: boolean
  estimatedTime?: string
  keyConcepts?: KeyConcept[]
  learningPath?: LearningStep[]
  resources?: Resources
  technologies?: string[]
  importance?: string
  links?: string[]
  progress?: number
}

export interface RoadmapNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: NodeData
}

export interface RoadmapEdge {
  id: string
  source: string
  target: string
  type?: string
  style?: Record<string, any>
}
