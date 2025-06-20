<template>
  <div class="status-dropdown">
    <label class="dropdown-label">
      📋 Estado del Nodo
    </label>
    
    <select 
      v-model="currentStatus" 
      @change="handleStatusChange"
      class="status-select"
    >
      <option value="pending">🕐 Pendiente</option>
      <option value="in-progress">⚡ En Progreso</option>
      <option value="completed">✅ Completado</option>
      <option value="skipped">⏭️ Omitida</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProgressStore } from '@/stores/progress'

interface Props {
  nodeId: string
  initialStatus?: 'pending' | 'in-progress' | 'completed' | 'skipped'
}

interface Emits {
  (e: 'statusChanged', status: 'pending' | 'in-progress' | 'completed' | 'skipped'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const progressStore = useProgressStore()
const currentStatus = ref<'pending' | 'in-progress' | 'completed' | 'skipped'>(
  props.initialStatus || 'pending'
)

// Manejar cambio de estado
function handleStatusChange() {
  // Actualizar en el store (que persistirá en DB)
  progressStore.updateNodeStatus(props.nodeId, currentStatus.value)
  
  // Emitir evento para que el componente padre pueda reaccionar
  emit('statusChanged', currentStatus.value)
}

// Observar cambios en el prop initialStatus
watch(
  () => props.initialStatus,
  (newStatus) => {
    if (newStatus) {
      currentStatus.value = newStatus
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.status-dropdown {
  margin-top: 16px;
}

.dropdown-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #f8f8f2;
  margin-bottom: 8px;
}

.status-select {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #6272a4;
  border-radius: 8px;
  background: #282a36;
  color: #f8f8f2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.status-select:hover {
  border-color: #bd93f9;
}

.status-select:focus {
  outline: none;
  border-color: #8be9fd;
  box-shadow: 0 0 0 3px rgba(139, 233, 253, 0.2);
}

.status-select option {
  background: #282a36;
  color: #f8f8f2;
  padding: 8px;
}

/* Animaciones */
.status-dropdown {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos hover para el select */
.status-select:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(189, 147, 249, 0.2);
}
</style>
