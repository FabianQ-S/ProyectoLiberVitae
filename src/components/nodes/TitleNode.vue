<!-- Nodo de Título/Fase - Sin información de deployment -->
<template>
  <div class="title-node" :style="getNodeStyle()">
    <div class="title-content">
      <div class="phase-icon">🌟</div>
      <h2 class="phase-title">{{ data.label }}</h2>
      <p class="phase-subtitle">{{ data.description }}</p>
    </div>
    <!-- Handles para conexiones -->
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Left" id="left" />
    <Handle type="source" :position="Position.Right" id="right" />
    <Handle type="source" :position="Position.Right" id="right-1" style="top: 30%" />
    <Handle type="source" :position="Position.Right" id="right-2" style="top: 70%" />
    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Bottom" id="target-bottom" />
    <Handle type="target" :position="Position.Left" id="target-left" />
    <Handle type="target" :position="Position.Right" id="target-right" />
    <Handle type="target" :position="Position.Right" id="right-1" style="top: 30%" />
    <Handle type="target" :position="Position.Right" id="right-2" style="top: 70%" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

interface NodeData {
  label: string
  description?: string
}

const props = defineProps<{
  data: NodeData
  id: string
}>()

const progressStore = useProgressStore()

// Determinar si la fase está completa basándose en los nodos obligatorios
const isPhaseCompleted = computed(() => {
  // Obtener la fase basada en el ID
  const phaseNumber = getPhaseNumber()
  if (phaseNumber === null) return false
  
  // Obtener todos los nodos obligatorios de esta fase
  const requiredNodesOfPhase = getRequiredNodesForPhase(phaseNumber)
  
  // Verificar si todos están completados
  return requiredNodesOfPhase.every(nodeId => {
    const node = progressStore.getNodeById(nodeId)
    return node?.data?.status === 'completed'
  })
})

// Función principal que combina estilo de fase y estado - EFECTO CRISTAL ELEGANTE MEJORADO
function getNodeStyle() {
  const baseStyle = getPhaseStyle()
  
  if (isPhaseCompleted.value) {
    return {
      ...baseStyle,
      background: 'linear-gradient(135deg, rgba(139, 233, 253, 0.25), rgba(139, 233, 253, 0.1))',
      backdropFilter: 'blur(20px) saturate(2.5) brightness(1.4) contrast(1.2)',
      boxShadow: `
        0 12px 40px rgba(139, 233, 253, 0.4),
        0 6px 20px rgba(0, 0, 0, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 0.15),
        inset 0 -2px 0 rgba(139, 233, 253, 0.3),
        inset 0 0 20px rgba(139, 233, 253, 0.1)
      `,
      border: '4px solid rgba(139, 233, 253, 0.9)',
      borderRadius: '12px',
      overflow: 'hidden',
      transform: 'translateZ(0)', // Hardware acceleration
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  
  return baseStyle
}

// Clases CSS dinámicas
function getNodeClasses() {
  return {
    'phase-completed': isPhaseCompleted.value
  }
}

// Extraer el número de fase del ID o label
function getPhaseNumber(): number | null {
  const label = props.data.label.toLowerCase()
  if (label.includes('fase 0')) return 0
  if (label.includes('fase 1')) return 1
  if (label.includes('fase 2')) return 2
  if (label.includes('fase 3')) return 3
  return null
}

// Mapeo de nodos obligatorios por fase
function getRequiredNodesForPhase(phaseNumber: number): string[] {
  const phaseNodeMap = {
    0: ['html-css-required', 'javascript-required', 'git-github-required', 'npm-required'],
    1: ['vite-required', 'vue-required', 'react-required', 'modern-css-required'],
    2: ['testing-vitest-required', 'express-required', 'nuxt-required'],
    3: ['electron-required', 'astro-required', 'expo-rn-required']
  }
  
  return phaseNodeMap[phaseNumber as keyof typeof phaseNodeMap] || []
}

// Función para obtener el estilo según la fase (cyan más oscuro progresivamente)
function getPhaseStyle() {
  const label = props.data.label.toLowerCase()
  
  if (label.includes('fase 0')) {
    return {
      background: '#8BE9FD', // Cyan más claro - Fase inicial
      border: '5px solid #bd93f9', // Morado Dracula - Más grueso
      boxShadow: '0 8px 25px rgba(139, 233, 253, 0.3)'
    }
  } else if (label.includes('fase 1')) {
    return {
      background: '#6FD3E8', // Cyan medio-claro
      border: '5px solid #bd93f9', // Morado Dracula - Más grueso
      boxShadow: '0 8px 25px rgba(111, 211, 232, 0.3)'
    }
  } else if (label.includes('fase 2')) {
    return {
      background: '#53BDD3', // Cyan medio-oscuro
      border: '5px solid #bd93f9', // Morado Dracula - Más grueso
      boxShadow: '0 8px 25px rgba(83, 189, 211, 0.3)'
    }
  } else if (label.includes('fase 3')) {
    return {
      background: '#37A7BE', // Cyan más oscuro - Fase final
      border: '5px solid #bd93f9', // Morado Dracula - Más grueso
      boxShadow: '0 8px 25px rgba(55, 167, 190, 0.3)'
    }
  }
  
  // Default fallback
  return {
    background: '#8BE9FD',
    border: '5px solid #bd93f9', // Morado Dracula - Más grueso
    boxShadow: '0 8px 25px rgba(139, 233, 253, 0.3)'
  }
}
</script>

<style scoped>
.title-node {
  min-width: 320px;
  min-height: 70px;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  overflow: hidden; /* Para que el efecto cristal se mantenga dentro del nodo */
}

.title-node:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(139, 233, 253, 0.5);
  border-color: #ff79c6;
}

.title-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.phase-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(139, 233, 253, 0.8));
}

.phase-title {
  color: #282a36;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.phase-subtitle {
  color: #282a36;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  max-width: 280px;
  line-height: 1.3;
}
</style>
