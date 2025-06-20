<!-- Botón Reset Fijo en esquina superior derecha del cuerpo -->
<template>
  <div class="fixed-reset-container">
    <button 
      @click="openResetModal"
      class="fixed-reset-button"
      title="Reset Todo"
    >
      <span class="reset-emoji">🔄</span>
      <span class="reset-text">Reset</span>
    </button>
  </div>

  <!-- Modal de confirmación para reset -->
  <div v-if="showResetModal" class="modal-overlay" @click="closeResetModal">
    <div class="modal-content" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <h2>🔄 Reset Todo</h2>
        <button @click="closeResetModal" class="close-btn">✕</button>
      </div>
      
      <!-- Descripción -->
      <div class="modal-description">
        <p>Restablecer todos los nodos al estado inicial "pendiente". Útil para empezar de nuevo o cambiar de especialización.</p>
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
          @keyup.enter="confirmReset"
        >
        
        <div class="modal-actions">
          <button @click="closeResetModal" class="cancel-btn">Cancelar</button>
          <button 
            @click="confirmReset" 
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
const showResetModal = ref(false)
const confirmationText = ref('')

// Funciones del modal
function openResetModal() {
  showResetModal.value = true
  confirmationText.value = ''
}

function closeResetModal() {
  showResetModal.value = false
  confirmationText.value = ''
}

function confirmReset() {
  if (confirmationText.value.toLowerCase() !== 'confirmo') return
  
  progressStore.resetAllNodes()
  
  closeResetModal()
}
</script>

<style scoped>
.fixed-reset-container {
  position: fixed;
  top: 220px;
  right: 80px;
  z-index: 999;
  pointer-events: auto;
}

.fixed-reset-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: 2px solid #ff5555;
  border-radius: 8px;
  background: rgba(68, 71, 90, 0.9);
  color: #f8f8f2;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(255, 85, 85, 0.3);
}

.fixed-reset-button:hover {
  transform: scale(1.05);
  border-color: #ff6b6b;
  box-shadow: 0 6px 20px rgba(255, 85, 85, 0.5);
  background: rgba(68, 71, 90, 0.95);
}

.reset-emoji {
  font-size: 16px;
}

.reset-text {
  white-space: nowrap;
}

/* Modal styles */
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
@media (max-width: 768px) {
  .fixed-reset-container {
    top: 190px;
    right: 60px;
  }
  
  .fixed-reset-button {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .reset-emoji {
    font-size: 14px;
  }
}
</style>
