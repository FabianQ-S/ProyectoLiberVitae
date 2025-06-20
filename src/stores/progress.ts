import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RoadmapNode } from '@/types/node.types'

// Definir types localmente hasta que SQLite funcione
type NodeStatus = 'pendiente' | 'en-progreso' | 'completado' | 'omitida'

// Mapeo entre estados de la UI y estados de la DB
const statusMapping = {
  'pending': 'pendiente' as NodeStatus,
  'in-progress': 'en-progreso' as NodeStatus,
  'completed': 'completado' as NodeStatus,
  'skipped': 'omitida' as NodeStatus
}

const reverseStatusMapping = {
  'pendiente': 'pending',
  'en-progreso': 'in-progress',
  'completado': 'completed',
  'omitida': 'skipped'
}

export const useProgressStore = defineStore('progress', () => {
  const nodes = ref<RoadmapNode[]>([])
  const selectedNodeId = ref<string | null>(null)

  // Funciones temporales para localStorage hasta que SQLite funcione
  const getStoredStatus = (nodeId: string): NodeStatus => {
    const stored = localStorage.getItem(`node_${nodeId}`)
    return (stored as NodeStatus) || 'pendiente'
  }

  const setStoredStatus = (nodeId: string, status: NodeStatus) => {
    localStorage.setItem(`node_${nodeId}`, status)
    localStorage.setItem(`node_${nodeId}_updated`, new Date().toISOString())
  }

  const getAllStoredProgress = () => {
    const progress: any[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('node_') && !key.endsWith('_updated')) {
        const nodeId = key.replace('node_', '')
        const status = localStorage.getItem(key) as NodeStatus
        const updated_at = localStorage.getItem(`node_${nodeId}_updated`) || new Date().toISOString()
        progress.push({ id: nodeId, status, updated_at })
      }
    }
    return progress
  }

  // Cargar estados desde la base de datos
  async function loadProgressFromDB() {
    const allProgress = getAllStoredProgress()
    const progressMap = new Map(allProgress.map((p: any) => [p.id, p.status]))
    
    // Actualizar nodos con estados de la DB
    nodes.value.forEach(node => {
      const dbStatus = progressMap.get(node.id)
      if (dbStatus) {
        const uiStatus = reverseStatusMapping[dbStatus as keyof typeof reverseStatusMapping] as 'pending' | 'in-progress' | 'completed' | 'skipped'
        node.data.status = uiStatus
      }
    })
  }

  // Actualizar estado de nodo (con persistencia en DB)
  async function updateNodeStatusWrapper(nodeId: string, status: 'pending' | 'in-progress' | 'completed' | 'skipped') {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      // Actualizar en memoria
      node.data.status = status
      
      // Persistir en base de datos
      const dbStatus = statusMapping[status]
      setStoredStatus(nodeId, dbStatus)
    }
  }

  // Inicializar nodos (llamar desde App.vue)
  function initializeNodes(nodeList: RoadmapNode[]) {
    nodes.value = nodeList
    loadProgressFromDB()
  }

  function setSelectedNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
  }

  function getNodeById(nodeId: string) {
    return nodes.value.find(n => n.id === nodeId)
  }

  // Resetear todos los nodos a estado 'pending'
  async function resetAllNodes() {
    for (const node of nodes.value) {
      if (node.data.type === 'required' || node.data.type === 'optional') {
        node.data.status = 'pending'
        // También persistir en DB
        setStoredStatus(node.id, 'pendiente') // 'pendiente' = pending en DB
      }
    }
  }

  // Estadísticas computadas
  const progressStats = computed(() => {
    const techNodes = nodes.value.filter(node => 
      node.data.type === 'required' || node.data.type === 'optional'
    )
    
    const completed = techNodes.filter(n => n.data.status === 'completed').length
    const inProgress = techNodes.filter(n => n.data.status === 'in-progress').length
    const pending = techNodes.filter(n => n.data.status === 'pending').length
    const skipped = techNodes.filter(n => n.data.status === 'skipped').length
    
    const requiredNodes = techNodes.filter(n => n.data.type === 'required')
    const optionalNodes = techNodes.filter(n => n.data.type === 'optional')
    
    const requiredCompleted = requiredNodes.filter(n => n.data.status === 'completed').length
    const optionalCompleted = optionalNodes.filter(n => n.data.status === 'completed').length
    
    return {
      completed,
      inProgress,
      pending,
      skipped,
      total: techNodes.length,
      requiredTotal: requiredNodes.length,
      optionalTotal: optionalNodes.length,
      requiredCompleted,
      optionalCompleted,
      progressPercentage: techNodes.length > 0 ? (completed / techNodes.length) * 100 : 0
    }
  })

  return {
    nodes,
    selectedNodeId,
    updateNodeStatus: updateNodeStatusWrapper,
    setSelectedNode,
    getNodeById,
    resetAllNodes,
    initializeNodes,
    loadProgressFromDB,
    progressStats
  }
})
