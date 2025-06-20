const { contextBridge, ipcRenderer } = require('electron')

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // API de base de datos
  database: {
    initialize: () => ipcRenderer.invoke('db:initialize'),
    getProgress: (nodeId) => ipcRenderer.invoke('db:getProgress', nodeId),
    updateProgress: (nodeId, status) => ipcRenderer.invoke('db:updateProgress', nodeId, status),
    getAllProgress: () => ipcRenderer.invoke('db:getAllProgress'),
    resetProgress: () => ipcRenderer.invoke('db:resetProgress')
  },
  
  // API de utilidades
  isElectron: true,
  platform: process.platform
})
