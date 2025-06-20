<template>
  <div class="tech-modal-overlay" @click="closeModal">
    <div class="tech-modal-content" @click.stop>
      <!-- 1. Nombre de la tecnología -->
      <div class="tech-header">
        <h2 class="tech-name">{{ node.data.label.replace(/🔥+\s/, '') }}</h2>
        <div class="header-controls">
          <!-- Dropdown de estado -->
          <StatusDropdown 
            :node-id="node.id"
            :initial-status="node.data.status"
            @status-changed="handleStatusChange"
            style="margin-right: 10px;"
          />
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
      </div>

      <!-- 2. Barra con dificultad, tiempo y tipo -->
      <div class="tech-info-bar">
        <div class="difficulty-section">
          <span class="label">Dificultad:</span>
          <div class="difficulty-fires">{{ getDifficultyFires() }}</div>
          <span class="difficulty-text">{{ getDifficultyName() }}</span>
        </div>
        <div class="time-section">
          <span class="label">⏰ Tiempo:</span>
          <span class="time-value">{{ node.data.estimatedTime || 'No especificado' }}</span>
        </div>
        <div class="type-section">
          <span class="label">Tipo:</span>
          <span class="type-badge" :class="node.data.type">
            {{ node.data.isPrincipal ? '⭐ Principal' : (node.data.type === 'required' ? '🔴 Obligatorio' : '🔵 Opcional') }}
          </span>
        </div>
      </div>

      <!-- 3. Descripción básica -->
      <div class="basic-description">
        <h3>📄 Descripción</h3>
        <p>{{ node.data.description }}</p>
      </div>

      <!-- 4. Descripción detallada -->
      <div class="detailed-description">
        <h3>📚 Descripción Detallada</h3>
        <p>{{ node.data.detailedDescription }}</p>
      </div>

      <!-- 5. Conceptos clave con tooltips -->
      <div class="key-concepts" v-if="node.data.keyConcepts">
        <h3>🎯 Conceptos Clave a Aprender</h3>
        <div class="concepts-grid">
          <div 
            v-for="concept in node.data.keyConcepts" 
            :key="concept.name"
            class="concept-item"
            :title="concept.tooltip"
            @mouseenter="showTooltip($event, concept.tooltip)"
            @mouseleave="hideTooltip"
          >
            {{ concept.name }}
          </div>
        </div>
      </div>

      <!-- 6. Ruta de aprendizaje con checkboxes -->
      <div class="learning-path" v-if="node.data.learningPath">
        <h3>🗺️ Ruta de Aprendizaje</h3>
        
        <!-- Mensaje informativo cuando está omitida -->
        <div v-if="checkboxesDisabled && node.data.status === 'skipped'" class="skip-notice">
          📌 Esta tecnología está marcada como omitida. El progreso se ha guardado y los pasos están congelados.
        </div>
        
        <div class="learning-steps">
          <div 
            v-for="step in node.data.learningPath" 
            :key="step.step"
            class="learning-step"
          >
            <label class="step-label" :class="{ disabled: checkboxesDisabled }">
              <input 
                type="checkbox" 
                v-model="step.completed"
                @change="handleCheckboxChange"
                :disabled="checkboxesDisabled"
                class="step-checkbox"
              >
              <span class="step-number">{{ step.step }}</span>
              <span class="step-title">{{ step.title }}</span>
            </label>
          </div>
        </div>
        <div class="progress-indicator">
          <div class="progress-text">
            Progreso: {{ completedSteps }}/{{ totalSteps }} pasos completados
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 7. Enlaces de material de aprendizaje -->
      <div class="learning-resources" v-if="node.data.resources">
        <h3>🔗 Material de Aprendizaje</h3>
        <div class="resources-grid">
          <a 
            :href="node.data.resources.documentation" 
            target="_blank" 
            class="resource-link documentation"
          >
            📖 Documentación Oficial
          </a>
          <a 
            :href="node.data.resources.video" 
            target="_blank" 
            class="resource-link video"
          >
            🎥 Video Tutorial
          </a>
          <a 
            :href="node.data.resources.additional" 
            target="_blank" 
            class="resource-link additional"
          >
            🌟 Recurso Adicional
          </a>
        </div>
      </div>

      <!-- Tooltip flotante -->
      <div 
        v-if="tooltipVisible" 
        class="floating-tooltip"
        :style="tooltipStyle"
      >
        {{ tooltipText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useProgressStore } from '@/stores/progress'
import StatusDropdown from './StatusDropdown.vue'
import type { RoadmapNode } from '@/types/node.types'

interface Props {
  node: RoadmapNode
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const progressStore = useProgressStore()

// Tooltip state
const tooltipVisible = ref(false)
const tooltipText = ref('')
const tooltipStyle = ref({})

// Control de checkboxes deshabilitados
const checkboxesDisabled = ref(false)

// Learning progress computed
const completedSteps = computed(() => {
  return props.node.data.learningPath?.filter(step => step.completed).length || 0
})

const totalSteps = computed(() => {
  return props.node.data.learningPath?.length || 0
})

const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0
  return Math.round((completedSteps.value / totalSteps.value) * 100)
})

// Observar cambios en el estado del nodo para sincronizar checkboxes
watch(() => props.node.data.status, (newStatus) => {
  syncCheckboxesWithStatus(newStatus)
}, { immediate: true })

// Methods
function closeModal() {
  emit('close')
}

function getDifficultyFires() {
  const difficulty = props.node.data.difficulty || 3
  return '🔥'.repeat(difficulty)
}

function getDifficultyName() {
  const names = {
    1: 'Muy Fácil',
    2: 'Fácil', 
    3: 'Medio',
    4: 'Difícil',
    5: 'Muy Difícil'
  }
  return names[props.node.data.difficulty as keyof typeof names] || 'Medio'
}

function showTooltip(event: MouseEvent, text: string) {
  tooltipText.value = text
  tooltipVisible.value = true
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  tooltipStyle.value = {
    left: rect.left + 'px',
    top: (rect.top - 60) + 'px'
  }
}

function hideTooltip() {
  tooltipVisible.value = false
}

function updateLearningProgress() {
  // Solo actualizar el estado automáticamente si no está en "skipped"
  if (props.node.data.status !== 'skipped') {
    // Si algún checkbox se marca y el estado es "pending", cambiar a "in-progress"
    if (completedSteps.value > 0 && props.node.data.status === 'pending') {
      progressStore.updateNodeStatus(props.node.id, 'in-progress')
    }
    // Si todos los pasos están completados, marcar como completado
    else if (completedSteps.value === totalSteps.value && totalSteps.value > 0) {
      progressStore.updateNodeStatus(props.node.id, 'completed')
    }
    // Si se desmarca algún paso y estaba completado, cambiar a "in-progress"
    else if (completedSteps.value < totalSteps.value && props.node.data.status === 'completed') {
      progressStore.updateNodeStatus(props.node.id, 'in-progress')
    }
    // Si se desmarcan todos los pasos, volver a "pending"
    else if (completedSteps.value === 0 && props.node.data.status === 'in-progress') {
      progressStore.updateNodeStatus(props.node.id, 'pending')
    }
  }
}

function syncCheckboxesWithStatus(status: string) {
  if (!props.node.data.learningPath) return
  
  switch (status) {
    case 'completed':
      // Marcar todos los checkboxes como completados
      props.node.data.learningPath.forEach(step => {
        step.completed = true
      })
      checkboxesDisabled.value = false
      break
      
    case 'skipped':
      // Congelar los checkboxes en su estado actual
      checkboxesDisabled.value = true
      break
      
    case 'pending':
    case 'in-progress':
      // Liberar los checkboxes para que puedan ser editados
      checkboxesDisabled.value = false
      // Si cambia de "completed" a otro estado, desmarcar todos
      if (status === 'pending') {
        props.node.data.learningPath.forEach(step => {
          step.completed = false
        })
      }
      break
  }
}

function handleStatusChange(newStatus: string) {
  // Actualizar el estado del nodo
  props.node.data.status = newStatus as any
  
  // Si el estado cambió a "skipped" desde otro estado, mantener el progreso actual
  if (newStatus === 'skipped') {
    // Los checkboxes se congelan pero mantienen su estado
    checkboxesDisabled.value = true
  }
  // Si cambió de "skipped" a cualquier otro estado, reactivar los checkboxes
  else if (props.node.data.status === 'skipped') {
    checkboxesDisabled.value = false
  }
  
  // Sincronizar los checkboxes con el nuevo estado
  syncCheckboxesWithStatus(newStatus)
}

function handleCheckboxChange() {
  // Si el nodo está en "skipped" y alguien marca un checkbox, cambiar a "in-progress"
  if (props.node.data.status === 'skipped') {
    progressStore.updateNodeStatus(props.node.id, 'in-progress')
    props.node.data.status = 'in-progress'
    checkboxesDisabled.value = false
  }
  
  // Luego ejecutar la lógica normal de progreso
  updateLearningProgress()
}
</script>

<style scoped>
.tech-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.tech-modal-content {
  background: linear-gradient(135deg, rgba(40, 42, 54, 0.98), rgba(68, 71, 90, 0.95));
  border-radius: 16px;
  border: 1px solid #6272a4;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
}

/* Header */
.tech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #44475a;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tech-name {
  font-size: 24px;
  font-weight: 700;
  color: #f8f8f2;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6272a4;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff5555;
}

/* Info Bar */
.tech-info-bar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(68, 71, 90, 0.3);
  margin: 0;
}

.difficulty-section, .time-section, .type-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #6272a4;
  font-weight: 500;
  text-transform: uppercase;
}

.difficulty-fires {
  font-size: 18px;
}

.difficulty-text {
  font-size: 12px;
  color: #f8f8f2;
  font-weight: 600;
}

.time-value {
  font-size: 14px;
  color: #8be9fd;
  font-weight: 600;
}

.type-badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.type-badge.required {
  background: rgba(255, 85, 85, 0.2);
  color: #ff5555;
}

.type-badge.optional {
  background: rgba(139, 233, 253, 0.2);
  color: #8be9fd;
}

/* Content sections */
.basic-description,
.detailed-description,
.key-concepts,
.learning-path,
.learning-resources {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(68, 71, 90, 0.5);
}

.basic-description h3,
.detailed-description h3,
.key-concepts h3,
.learning-path h3,
.learning-resources h3 {
  font-size: 16px;
  color: #bd93f9;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.basic-description p,
.detailed-description p {
  color: #f8f8f2;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
}

/* Key Concepts */
.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.concept-item {
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid rgba(139, 233, 253, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #8be9fd;
  font-size: 13px;
  font-weight: 500;
  cursor: help;
  transition: all 0.2s;
}

.concept-item:hover {
  background: rgba(139, 233, 253, 0.2);
  border-color: #8be9fd;
  transform: translateY(-1px);
}

/* Learning Path */
.learning-path {
  padding: 24px;
  border-bottom: 1px solid rgba(68, 71, 90, 0.3);
}

.skip-notice {
  background: linear-gradient(135deg, rgba(255, 85, 85, 0.1), rgba(255, 121, 198, 0.1));
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  color: #ff79c6;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.learning-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.learning-step {
  background: rgba(68, 71, 90, 0.4);
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.learning-step:hover {
  border-color: #bd93f9;
}

.step-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #f8f8f2;
  font-size: 14px;
}

.step-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #50fa7b;
}

.step-number {
  background: #bd93f9;
  color: #282a36;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-title {
  font-weight: 500;
}

/* Estilos para checkboxes deshabilitados */
.step-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.step-label.disabled .step-checkbox {
  cursor: not-allowed;
}

.step-label.disabled .step-number {
  background: #6272a4;
  color: #44475a;
}

.step-label.disabled .step-title {
  color: #6272a4;
}

/* Progress Indicator */
.progress-indicator {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(68, 71, 90, 0.5);
}

.progress-text {
  color: #6272a4;
  font-size: 12px;
  margin-bottom: 8px;
  text-align: center;
}

.progress-bar {
  height: 6px;
  background: rgba(68, 71, 90, 0.6);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #50fa7b, #8be9fd);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Resources */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.resource-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.resource-link.documentation {
  background: rgba(255, 184, 108, 0.1);
  color: #ffb86c;
  border-color: rgba(255, 184, 108, 0.3);
}

.resource-link.documentation:hover {
  background: rgba(255, 184, 108, 0.2);
  border-color: #ffb86c;
}

.resource-link.video {
  background: rgba(255, 85, 85, 0.1);
  color: #ff5555;
  border-color: rgba(255, 85, 85, 0.3);
}

.resource-link.video:hover {
  background: rgba(255, 85, 85, 0.2);
  border-color: #ff5555;
}

.resource-link.additional {
  background: rgba(189, 147, 249, 0.1);
  color: #bd93f9;
  border-color: rgba(189, 147, 249, 0.3);
}

.resource-link.additional:hover {
  background: rgba(189, 147, 249, 0.2);
  border-color: #bd93f9;
}

/* Floating Tooltip */
.floating-tooltip {
  position: fixed;
  background: rgba(40, 42, 54, 0.95);
  color: #f8f8f2;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  max-width: 250px;
  z-index: 1001;
  border: 1px solid #6272a4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .tech-info-bar {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .concepts-grid,
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-modal-content {
    margin: 10px;
    max-height: 95vh;
  }
}
</style>
