<template>
  <div class="floating-progress-menu">
    <div class="progress-header">
      <h3>📊 Progreso</h3>
    </div>
    
    <div class="progress-stats">
      <div class="stat-item required">
        <div class="stat-header">
          <span class="stat-label">Obligatorios</span>
          <span class="stat-value">{{ requiredCompleted }}/{{ requiredTotal }}</span>
        </div>
        <div class="mini-progress-bar">
          <div 
            class="mini-progress-fill required-fill" 
            :style="{ width: requiredProgressPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="stat-item optional">
        <div class="stat-header">
          <span class="stat-label">Opcionales</span>
          <span class="stat-value">{{ optionalCompleted }}/{{ optionalTotal }}</span>
        </div>
        <div class="mini-progress-bar">
          <div 
            class="mini-progress-fill optional-fill" 
            :style="{ width: optionalProgressPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <div class="stat-item total">
        <span class="stat-label">Total</span>
        <span class="stat-value">{{ totalCompleted }}/{{ totalCount }}</span>
      </div>
    </div>
    
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>
    
    <div class="progress-percentage">
      {{ Math.round(progressPercentage) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

// Usar las estadísticas del store
const stats = computed(() => progressStore.progressStats)

// Propiedades computadas para el template
const requiredCompleted = computed(() => stats.value.requiredCompleted)
const requiredTotal = computed(() => stats.value.requiredTotal)
const optionalCompleted = computed(() => stats.value.optionalCompleted)
const optionalTotal = computed(() => stats.value.optionalTotal)
const totalCompleted = computed(() => stats.value.completed)
const totalCount = computed(() => stats.value.total)
const progressPercentage = computed(() => stats.value.progressPercentage)

// Porcentajes individuales para las mini barras
const requiredProgressPercentage = computed(() => {
  return requiredTotal.value > 0 ? (requiredCompleted.value / requiredTotal.value) * 100 : 0
})

const optionalProgressPercentage = computed(() => {
  return optionalTotal.value > 0 ? (optionalCompleted.value / optionalTotal.value) * 100 : 0
})

// Función para actualizar estadísticas (llamada desde el componente padre)
function updateStats() {
  // Las estadísticas se actualizan automáticamente através del store reactivo
  // Esta función existe para compatibilidad con el componente padre
}

// Exponer función para actualizar desde el componente padre
defineExpose({
  updateStats
})
</script>

<style scoped>
.floating-progress-menu {
  position: fixed;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #44475a 0%, #282a36 100%);
  border: 2px solid #bd93f9;
  border-radius: 16px;
  padding: 16px;
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  min-width: 250px;
}

.progress-header {
  margin-bottom: 12px;
}

.progress-header h3 {
  color: #f8f8f2;
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-item {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-item.required {
  background: rgba(255, 121, 198, 0.1);
  border: 1px solid #ff79c6;
}

.stat-item.optional {
  background: rgba(189, 147, 249, 0.1);
  border: 1px solid #bd93f9;
}

.stat-item.total {
  background: rgba(139, 233, 253, 0.1);
  border: 1px solid #8be9fd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.mini-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(98, 114, 164, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.required-fill {
  background: linear-gradient(90deg, #ff79c6 0%, #ff92d0 100%);
}

.optional-fill {
  background: linear-gradient(90deg, #bd93f9 0%, #d4afff 100%);
}

.stat-label {
  color: #f8f8f2;
}

.stat-value {
  color: #50fa7b;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(98, 114, 164, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #50fa7b 0%, #8be9fd 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-percentage {
  text-align: center;
  color: #8be9fd;
  font-size: 14px;
  font-weight: 700;
}

/* Animación de entrada */
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.floating-progress-menu {
  animation: slideInLeft 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .floating-progress-menu {
    top: 10px;
    left: 10px;
    min-width: 200px;
    padding: 12px;
  }
  
  .progress-header h3 {
    font-size: 14px;
  }
  
  .stat-item {
    font-size: 12px;
    padding: 6px 8px;
  }
  
  .stat-header {
    margin-bottom: 4px;
  }
  
  .mini-progress-bar {
    height: 3px;
  }
  
  .progress-percentage {
    font-size: 12px;
  }
}
</style>
