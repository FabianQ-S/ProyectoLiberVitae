<!-- Nodo Opcional - Con líneas punteadas y colores de dificultad -->
<template>
  <div class="optional-node" :style="getNodeStyle()" :class="{ 'node-strikethrough': nodeStatus === 'skipped' }">
    <!-- Status indicator/emoji -->
    <div class="status-indicat.optional-node:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(189, 147, 249, 0.4);
  border-color: #8be9fd;
  border-style: solid;
}

.status-indicator {eStatus !== 'pending'">
      {{ getStatusEmoji() }}
    </div>
    
    <div class="node-content">
      <div class="tech-icon" style="color: #cba6f7;">{{ getDifficultyFires() }}</div>
      <h3 class="tech-title">{{ getTitleWithoutFires() }}</h3>
      <div class="optional-badge">OPCIONAL</div>
      <div class="time-indicator">
        {{ getTimeEstimate() }}
      </div>
    </div>
    <!-- Handles para conexiones -->
    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Bottom" id="target-bottom" />
    <Handle type="target" :position="Position.Left" id="target-left" />
    <Handle type="target" :position="Position.Right" id="target-right" />
    <Handle type="source" :position="Position.Top" id="top" />
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Left" id="left" />
    <Handle type="source" :position="Position.Right" id="right" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

interface NodeData {
  label: string
  description?: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  status?: 'pending' | 'in-progress' | 'completed' | 'skipped'
}

const props = defineProps<{
  data: NodeData
  id: string
}>()

const progressStore = useProgressStore()

// Estado reactivo del nodo
const nodeStatus = computed(() => {
  const node = progressStore.getNodeById(props.id)
  return node?.data?.status || 'pending'
})

// Función principal que combina dificultad y estado
function getNodeStyle() {
  const baseStyle = getDifficultyStyle()
  const statusStyle = getStatusStyle()
  
  return {
    ...baseStyle,
    ...statusStyle
  }
}

// Emoji del estado
function getStatusEmoji() {
  switch (nodeStatus.value) {
    case 'completed': return '✅'
    case 'in-progress': return '⏳'
    case 'skipped': return '⏸️'
    default: return ''
  }
}

// Estilos específicos del estado - EFECTO CRISTAL MEJORADO
function getStatusStyle() {
  const status = nodeStatus.value
  
  if (status === 'pending') {
    return {}
  }
  
  const baseStyle = {
    borderRadius: '12px',
    overflow: 'hidden',
    transform: 'translateZ(0)', // Hardware acceleration
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
  
  switch (status) {
    case 'completed':
      return {
        ...baseStyle,
        border: '2px dashed #50FA7B',
        background: 'linear-gradient(135deg, rgba(80, 250, 123, 0.15), rgba(68, 71, 90, 0.7))',
        backdropFilter: 'blur(25px) saturate(2.5) brightness(1.4) contrast(1.2)',
        boxShadow: `
          0 8px 32px rgba(80, 250, 123, 0.3),
          0 4px 16px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(80, 250, 123, 0.2)
        `
      }
    case 'in-progress':
      return {
        ...baseStyle,
        border: '2px dashed #FFB86C',
        background: 'linear-gradient(135deg, rgba(255, 184, 108, 0.15), rgba(68, 71, 90, 0.7))',
        backdropFilter: 'blur(25px) saturate(2.5) brightness(1.4) contrast(1.2)',
        boxShadow: `
          0 8px 32px rgba(255, 184, 108, 0.3),
          0 4px 16px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(255, 184, 108, 0.2)
        `
      }
    case 'skipped':
      return {
        ...baseStyle,
        border: '2px dashed #11111b',
        background: '#44475a',
        color: '#6c7086',
        opacity: '0.7'
      }
    default:
      return {}
  }
}

// Sistema de colores COMPARTIDO (1-5) - Mismo que obligatorios pero con bordes punteados
function getDifficultyStyle() {
  switch (props.data.difficulty) {
    case 1: // Muy Fácil - Fondo gris con borde cyan punteado
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #8be9fd', // Borde cyan punteado
        boxShadow: '0 4px 15px rgba(139, 233, 253, 0.3)',
        color: '#f8f8f2' // Texto claro
      }
    case 2: // Fácil - Fondo gris con borde verde punteado
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #50fa7b', // Borde verde punteado
        boxShadow: '0 4px 15px rgba(80, 250, 123, 0.4)',
        color: '#f8f8f2' // Texto claro
      }
    case 3: // Medio - Fondo gris con borde naranja punteado
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #ffb86c', // Borde naranja punteado
        boxShadow: '0 4px 15px rgba(255, 184, 108, 0.4)',
        color: '#f8f8f2' // Texto claro
      }
    case 4: // Difícil - Fondo gris con borde rosa punteado
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #eba0ac', // Borde rosa punteado
        boxShadow: '0 4px 15px rgba(235, 160, 172, 0.5)',
        color: '#f8f8f2' // Texto claro
      }
    case 5: // Muy Difícil - Fondo gris con borde rojo punteado
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #ff5555', // Borde rojo punteado
        boxShadow: '0 4px 15px rgba(255, 85, 85, 0.6)',
        color: '#f8f8f2' // Texto claro
      }
    default:
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px dashed #ffb86c', // Borde naranja punteado por defecto
        boxShadow: '0 4px 15px rgba(255, 184, 108, 0.4)',
        color: '#f8f8f2' // Texto claro
      }
  }
}

function getDifficultyTextStyle() {
  switch (props.data.difficulty) {
    case 1: return { color: '#8be9fd', fontWeight: 'bold' } // Cyan suave
    case 2: return { color: '#50fa7b', fontWeight: 'bold' } // Verde suave
    case 3: return { color: '#ffb86c', fontWeight: 'bold' } // Naranja medio
    case 4: return { color: '#eba0ac', fontWeight: 'bold' } // Rosa
    case 5: return { color: '#ff5555', fontWeight: 'bold' } // Rojo intenso
    default: return { color: '#ffb86c', fontWeight: 'bold' }
  }
}

function getDifficultyLabel() {
  switch (props.data.difficulty) {
    case 1: return 'MUY FÁCIL'
    case 2: return 'FÁCIL'
    case 3: return 'MEDIO'
    case 4: return 'DIFÍCIL'
    case 5: return 'MUY DIFÍCIL'
    default: return 'MEDIO'
  }
}

function getDifficultyFires() {
  const fires = props.data.difficulty || 3
  return '🔥'.repeat(fires)
}

function getTimeEstimate() {
  switch (props.data.difficulty) {
    case 1: return 'Tiempo estimado: 1-2 semanas'
    case 2: return 'Tiempo estimado: 2-4 semanas'
    case 3: return 'Tiempo estimado: 1-2 meses'
    case 4: return 'Tiempo estimado: 2-3 meses'
    case 5: return 'Tiempo estimado: 3-6 meses'
    default: return 'Tiempo estimado: 1-2 meses'
  }
}

function getTitleWithoutFires() {
  return props.data.label.replace(/🔥+\s?/g, '')
}
</script>

<style scoped>
.optional-node {
  min-width: 300px;
  min-height: 55px;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.optional-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(189, 147, 249, 0.4);
  border-color: #8be9fd;
  border-style: solid;
}

.node-dimmed {
  filter: blur(1px);
  opacity: 0.7 !important;
}

.status-indicator {
  position: absolute;
  top: -8px;
  left: -8px;
  background: rgba(40, 42, 54, 0.9);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid #44475a;
  z-index: 10;
  animation: statusPop 0.3s ease-out;
}

@keyframes statusPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
}

.tech-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(189, 147, 249, 0.8));
}

.tech-title {
  color: #f8f8f2;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 1px 5px rgba(189, 147, 249, 0.3);
}

.optional-badge {
  background: #bd93f9;
  color: #1a1a2e;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.time-indicator {
  font-size: 0.65rem;
  color: #f8f8f2;
  opacity: 0.8;
  font-weight: 500;
  margin-top: 4px;
}

.difficulty-indicator {
  font-size: 0.7rem;
  font-weight: bold;
  margin-top: 4px;
  opacity: 0.8;
}

/* Estilos para nodos omitidos (skipped) - X con difuminado */
.node-strikethrough {
  position: relative;
  filter: blur(2px) opacity(0.6);
  transition: filter 0.3s ease;
}

.node-strikethrough:hover {
  filter: blur(0.5px) opacity(0.95);
}

.node-strikethrough::before,
.node-strikethrough::after {
  content: '';
  position: absolute;
  top: 5%;
  left: 5%;
  right: 5%;
  bottom: 5%;
  background-color: #11111b;
  z-index: 20;
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(17, 17, 27, 0.6);
}

/* Línea diagonal de la X (/) */
.node-strikethrough::before {
  width: 4px;
  height: 45%;
  transform: rotate(45deg);
  transform-origin: center;
  left: 50%;
  top: 50%;
  margin-left: -2px;
  margin-top: -22.5%;
}

/* Línea diagonal de la X (\) */
.node-strikethrough::after {
  width: 4px;
  height: 45%;
  transform: rotate(-45deg);
  transform-origin: center;
  left: 50%;
  top: 50%;
  margin-left: -2px;
  margin-top: -22.5%;
}
</style>
