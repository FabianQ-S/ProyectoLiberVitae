<!-- Nodo Obligatorio - Con efectos visuales de blur para estados -->
<template>
  <div class="required-node" :style="getNodeStyle()" :class="getNodeClasses()">
    <!-- Status indicator/emoji -->
    <div class="status-indicator" v-if="nodeStatus !== 'pending'">
      {{ getStatusEmoji() }}
    </div>
    
    <div class="node-content">
      <div class="tech-icon" style="color: #cba6f7;">{{ getDifficultyFires() }}</div>
      <h3 class="tech-title">{{ getTitleWithoutFires() }}</h3>
      <div class="required-badge">OBLIGATORIO</div>
      <div class="time-indicator">
        {{ getTimeEstimate() }}
      </div>
    </div>
    <!-- Handles para conexiones -->
    <Handle type="target" :position="Position.Top" />
    <Handle type="target" :position="Position.Top" id="target-top" />
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

// Clases CSS dinámicas
function getNodeClasses() {
  return {
    'node-blurred': nodeStatus.value !== 'pending' && nodeStatus.value !== 'skipped',
    'node-strikethrough': nodeStatus.value === 'skipped'
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

// Estilos específicos del estado - EFECTO CRISTAL INTENSO CON FONDO DIFUMINADO
function getStatusStyle() {
  switch (nodeStatus.value) {
    case 'completed':
      return {
        border: '2px solid #50FA7B',
        background: 'linear-gradient(135deg, rgba(80, 250, 123, 0.15), rgba(68, 71, 90, 0.7))',
        backdropFilter: 'blur(25px) saturate(2.5) brightness(1.4) contrast(1.2)',
        boxShadow: '0 12px 40px rgba(80, 250, 123, 0.5), inset 0 3px 0 rgba(255, 255, 255, 0.25), 0 0 30px rgba(80, 250, 123, 0.3), inset 0 0 20px rgba(80, 250, 123, 0.1)',
        borderRadius: '12px'
      }
    case 'in-progress':
      return {
        border: '2px solid #FFB86C',
        background: 'linear-gradient(135deg, rgba(255, 184, 108, 0.15), rgba(68, 71, 90, 0.7))',
        backdropFilter: 'blur(25px) saturate(2.5) brightness(1.4) contrast(1.2)',
        boxShadow: '0 12px 40px rgba(255, 184, 108, 0.5), inset 0 3px 0 rgba(255, 255, 255, 0.25), 0 0 30px rgba(255, 184, 108, 0.3), inset 0 0 20px rgba(255, 184, 108, 0.1)',
        borderRadius: '12px'
      }
    case 'skipped':
      return {
        border: '2px solid #11111b',
        background: '#44475a',
        color: '#6c7086',
        opacity: '0.7'
      }
    default:
      return {}
  }
}

// Sistema de colores COMPARTIDO (1-5) - Dracula Theme
function getDifficultyStyle() {
  switch (props.data.difficulty) {
    case 1: // Muy Fácil - Fondo gris con borde cyan
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #8be9fd', // Borde cyan sólido
        boxShadow: '0 4px 15px rgba(139, 233, 253, 0.3)',
        color: '#f8f8f2' // Texto claro
      }
    case 2: // Fácil - Fondo gris con borde verde
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #50fa7b', // Borde verde sólido
        boxShadow: '0 4px 15px rgba(80, 250, 123, 0.4)',
        color: '#f8f8f2' // Texto claro
      }
    case 3: // Medio - Fondo gris con borde naranja
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #ffb86c', // Borde naranja sólido
        boxShadow: '0 4px 15px rgba(255, 184, 108, 0.4)',
        color: '#f8f8f2' // Texto claro
      }
    case 4: // Difícil - Fondo gris con borde rosa
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #eba0ac', // Borde rosa sólido
        boxShadow: '0 4px 15px rgba(235, 160, 172, 0.5)',
        color: '#f8f8f2' // Texto claro
      }
    case 5: // Muy Difícil - Fondo gris con borde rojo
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #ff5555', // Borde rojo sólido
        boxShadow: '0 4px 15px rgba(255, 85, 85, 0.6)',
        color: '#f8f8f2' // Texto claro
      }
    default:
      return {
        background: '#44475a', // Fondo gris uniforme
        border: '2px solid #ffb86c', // Borde naranja sólido por defecto
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
.required-node {
  min-width: 300px;
  min-height: 55px;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden; /* Para que el efecto cristal se mantenga dentro del nodo */
}

.required-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 85, 85, 0.4);
  border-color: #ff79c6;
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
  filter: drop-shadow(0 0 8px rgba(255, 85, 85, 0.8));
}

.tech-title {
  color: #f8f8f2;
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 0 1px 5px rgba(255, 85, 85, 0.3);
}

.required-badge {
  background: #ff5555;
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
