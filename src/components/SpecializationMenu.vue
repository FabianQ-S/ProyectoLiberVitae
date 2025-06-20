<!-- Menú de Especialización - 4 botones en 2x2 -->
<template>
  <div class="specialization-menu">
    <!-- 4 especializations en grid 2x2 -->
    <div class="specializations-grid">
      <button 
        v-for="spec in mainSpecializations" 
        :key="spec.id"
        @click="openModal(spec)"
        class="spec-button"
        :class="spec.id"
      >
        <span class="spec-emoji">{{ spec.emoji }}</span>
        <span class="spec-text">{{ spec.name }}</span>
      </button>
    </div>
  </div>

  <!-- Modal de confirmación -->
  <div v-if="selectedSpec" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <h2>{{ selectedSpec.emoji }} {{ selectedSpec.name }}</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <!-- Descripción motivacional -->
      <div class="modal-description">
        <p>{{ selectedSpec.description }}</p>
      </div>
      
      <!-- Advertencia (solo para especializations, no para reset) -->
      <div v-if="selectedSpec.id !== 'reset'" class="warning-section">
        <div class="warning-box">
          ⚠️ <strong>ATENCIÓN:</strong> Aplicar cualquier especialización reseteará todos tus avances actuales a cero. Esta acción no se puede deshacer.
        </div>
      </div>
      
      <!-- Confirmación -->
      <div class="confirmation-section">
        <label class="confirm-label">
          ⚠️ Escriba "confirmo" para aplicar:
        </label>
        <input 
          v-model="confirmationText" 
          type="text" 
          class="confirm-input"
          placeholder="confirmo"
          @keyup.enter="confirmAction"
        >
        
        <div class="modal-actions">
          <button @click="closeModal" class="cancel-btn">Cancelar</button>
          <button 
            @click="confirmAction" 
            :disabled="confirmationText.toLowerCase() !== 'confirmo'"
            class="confirm-btn"
            :class="{ disabled: confirmationText.toLowerCase() !== 'confirmo' }"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

// Estado del modal
const selectedSpec = ref<SpecializationType | null>(null)
const confirmationText = ref('')

// Tipos
interface SpecializationType {
  id: string
  name: string
  emoji: string
  description: string
  nodesToSkip: string[]
}

// 4 Especializaciones principales
const mainSpecializations: SpecializationType[] = [
  {
    id: 'vue',
    name: 'Vue Specialist',
    emoji: '🟢',
    description: 'Domina el ecosistema Vue puro y conviértete en un especialista frontend ultra enfocado. Solo Vue, Vite, Nuxt y herramientas oficiales del ecosistema. El framework más elegante y productivo del mercado. ¿Te animas?',
    nodesToSkip: [
      'react-required', 'expo-rn-required', 'modern-css-required', 
      'firebase-optional', 'graphql-optional', 'electron-required', 
      'astro-required', 'podman-optional', 'adonisjs-optional', 'inertia-optional'
    ]
  },
  {
    id: 'react',
    name: 'React Specialist', 
    emoji: '⚛️',
    description: 'Domina el ecosistema React puro y conviértete en un especialista frontend-móvil ultra enfocado. Solo React, React Native y herramientas oficiales del ecosistema. El estándar de la industria te espera. ¿Listo para brillar?',
    nodesToSkip: [
      'vue-required', 'nuxt-required', 'modern-css-required',
      'firebase-optional', 'express-required', 'graphql-optional', 
      'electron-required', 'astro-required', 'podman-optional', 
      'adonisjs-optional', 'inertia-optional'
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Testing',
    emoji: '🔧', 
    description: 'Domina el ecosistema backend puro y conviértete en el arquitecto de sistemas robustos. Solo APIs, testing exhaustivo y DevOps esencial. Los backends bien hechos son la diferencia entre un proyecto amateur y uno enterprise. ¿Aceptas el desafío?',
    nodesToSkip: [
      'vue-required', 'react-required', 'nuxt-required', 'expo-rn-required', 
      'modern-css-required', 'firebase-optional', 'electron-required', 
      'astro-required', 'inertia-optional'
    ]
  },
  {
    id: 'static',
    name: 'Sitios Estáticos',
    emoji: '📄',
    description: 'Domina el arte de los sitios estáticos ultrarrápidos y perfectos. Solo HTML/CSS perfecto, Astro y deployment estático. Performance y SEO extremos sin backend ni APIs complejas. ¿Te animas a crear la web más rápida?',
    nodesToSkip: [
      'vue-required', 'react-required', 'nuxt-required', 'expo-rn-required',
      'firebase-optional', 'express-required', 'graphql-optional', 
      'testing-library-optional', 'electron-required', 'adonisjs-optional',
      'podman-optional', 'inertia-optional'
    ]
  }
]

// Reset especialization (separado)
const resetSpecialization: SpecializationType = {
  id: 'reset',
  name: 'Reset Todo',
  emoji: '🔄',
  description: 'Restablecer todos los nodos al estado inicial "pendiente". Útil para empezar de nuevo o cambiar de especialización.',
  nodesToSkip: []
}

// Funciones del modal
function openModal(spec: SpecializationType) {
  selectedSpec.value = spec
  confirmationText.value = ''
}

function closeModal() {
  selectedSpec.value = null
  confirmationText.value = ''
}

function confirmAction() {
  if (confirmationText.value.toLowerCase() !== 'confirmo') return
  
  if (selectedSpec.value) {
    if (selectedSpec.value.id === 'reset') {
      applyReset()
    } else {
      applySpecialization(selectedSpec.value)
    }
  }
  
  closeModal()
}

function applySpecialization(spec: SpecializationType) {
  // Primero resetear todos los nodos a 'pending'
  progressStore.resetAllNodes()
  
  // Luego aplicar 'skipped' a los nodos específicos
  spec.nodesToSkip.forEach(nodeId => {
    progressStore.updateNodeStatus(nodeId, 'skipped')
  })
}

function applyReset() {
  progressStore.resetAllNodes()
}

// Exponer resetSpecialization para uso externo
defineExpose({
  resetSpecialization,
  openModal
})
</script>

<style scoped>
.specialization-menu {
  position: fixed;
  top: 80px;
  right: 80px;
  z-index: 999;
  pointer-events: auto;
}

.specializations-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  justify-items: center;
  align-items: center;
}

.spec-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 8px;
  border: 2px solid #6272a4;
  border-radius: 6px;
  background: rgba(68, 71, 90, 0.8);
  color: #f8f8f2;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 85px;
  max-width: 100px;
  text-align: center;
  justify-content: center;
}

.spec-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Colores específicos por especialización */
.spec-button.vue:hover {
  border-color: #50fa7b;
  box-shadow: 0 4px 15px rgba(80, 250, 123, 0.4);
}

.spec-button.react:hover {
  border-color: #8be9fd;
  box-shadow: 0 4px 15px rgba(139, 233, 253, 0.4);
}

.spec-button.backend:hover {
  border-color: #ffb86c;
  box-shadow: 0 4px 15px rgba(255, 184, 108, 0.4);
}

.spec-button.static:hover {
  border-color: #bd93f9;
  box-shadow: 0 4px 15px rgba(189, 147, 249, 0.4);
}

.spec-button.reset:hover {
  border-color: #ff5555;
  box-shadow: 0 4px 15px rgba(255, 85, 85, 0.4);
}

.spec-emoji {
  font-size: 14px;
}

.spec-text {
  white-space: nowrap;
}

/* Modal styles - Ahora debería funcionar perfectamente */
.modal-overlay {
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

.modal-content {
  background: linear-gradient(135deg, rgba(40, 42, 54, 0.98), rgba(68, 71, 90, 0.95));
  border-radius: 16px;
  border: 1px solid #6272a4;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(98, 114, 164, 0.3);
}

.modal-header h2 {
  color: #f8f8f2;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #6272a4;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff5555;
}

.modal-description {
  padding: 20px 24px;
}

.modal-description p {
  color: #f8f8f2;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.warning-section {
  padding: 0 24px 20px;
}

.warning-box {
  background: rgba(255, 85, 85, 0.1);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ff5555;
  font-size: 13px;
  font-weight: 500;
}

.confirmation-section {
  padding: 0 24px 24px;
  border-top: 1px solid rgba(98, 114, 164, 0.3);
  margin-top: 20px;
  padding-top: 20px;
}

.confirm-label {
  display: block;
  color: #ffb86c;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.confirm-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #6272a4;
  border-radius: 8px;
  background: rgba(40, 42, 54, 0.8);
  color: #f8f8f2;
  font-size: 14px;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.confirm-input:focus {
  outline: none;
  border-color: #8be9fd;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(98, 114, 164, 0.3);
  color: #f8f8f2;
}

.cancel-btn:hover {
  background: rgba(98, 114, 164, 0.5);
}

.confirm-btn {
  background: #50fa7b;
  color: #282a36;
}

.confirm-btn:hover:not(.disabled) {
  background: #5af78e;
  transform: translateY(-1px);
}

.confirm-btn.disabled {
  background: rgba(98, 114, 164, 0.3);
  color: rgba(248, 248, 242, 0.5);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
  .spec-button {
    min-width: 75px;
    max-width: 90px;
    padding: 4px 7px;
    font-size: 9px;
  }
  
  .spec-emoji {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .specializations-grid {
    gap: 4px;
  }
  
  .spec-button {
    min-width: 70px;
    max-width: 85px;
    padding: 4px 6px;
    font-size: 9px;
    gap: 3px;
  }
  
  .spec-emoji {
    font-size: 11px;
  }
}
</style>
