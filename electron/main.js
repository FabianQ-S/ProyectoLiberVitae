const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Configuración específica para resolver problemas de ICU en Windows
if (process.platform === 'win32') {
  // Asegurar que Electron encuentre los recursos ICU
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
  
  // Múltiples rutas posibles para icudtl.dat
  const possibleICUPaths = [
    // Ruta cuando está empaquetado con extraFiles
    path.join(process.resourcesPath, 'icudtl.dat'),
    // Ruta alternativa en el directorio de la aplicación
    path.join(path.dirname(process.execPath), 'icudtl.dat'),
    // Ruta tradicional en app.asar.unpacked
    path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'electron', 'dist', 'icudtl.dat'),
    // Ruta en desarrollo
    path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'icudtl.dat')
  ]
  
  // Buscar y configurar la ruta correcta de ICU
  for (const icuPath of possibleICUPaths) {
    if (require('fs').existsSync(icuPath)) {
      process.env.ICU_DATA_FILE = icuPath
      console.log('✅ ICU data found at:', icuPath)
      break
    }
  }
  
  // Si no se encuentra, intentar con la ruta del ejecutable
  if (!process.env.ICU_DATA_FILE) {
    const execDirICU = path.join(path.dirname(process.execPath), 'icudtl.dat')
    if (require('fs').existsSync(execDirICU)) {
      process.env.ICU_DATA_FILE = execDirICU
      console.log('✅ ICU data found in exec dir:', execDirICU)
    } else {
      console.warn('⚠️ ICU data file not found in any expected location')
    }
  }
}

// Forzar GTK 3 en Linux para compatibilidad con Fedora Budgie
if (process.platform === 'linux') {
  process.env.GDK_BACKEND = 'x11'
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
  process.env.ELECTRON_FORCE_IS_PACKAGED = 'true'
  
  // Configurar argumentos específicos para GTK 3
  if (!isDev) {
    app.commandLine.appendSwitch('--disable-gpu-sandbox')
    app.commandLine.appendSwitch('--disable-software-rasterizer')
    app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows')
    app.commandLine.appendSwitch('--disable-renderer-backgrounding')
    app.commandLine.appendSwitch('--disable-features', 'TranslateUI')
    app.commandLine.appendSwitch('--disable-ipc-flooding-protection')
    app.commandLine.appendSwitch('--no-sandbox')
  }
}

let mainWindow
let db = null

// Inicializar base de datos SQLite
function initializeDatabase() {
  try {
    const Database = require('better-sqlite3')
    db = new Database('roadmap-progress.db')
    
    // Crear tabla si no existe
    db.exec(`
      CREATE TABLE IF NOT EXISTS node_progress (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL DEFAULT 'pendiente',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('Base de datos SQLite inicializada correctamente')
  } catch (error) {
    console.error('Error inicializando base de datos:', error)
    db = null
  }
}

// IPC handlers para la base de datos
ipcMain.handle('db:initialize', async () => {
  if (!db) initializeDatabase()
  return db !== null
})

ipcMain.handle('db:getProgress', async (event, nodeId) => {
  if (!db) return null
  try {
    const stmt = db.prepare('SELECT * FROM node_progress WHERE id = ?')
    return stmt.get(nodeId) || null
  } catch (error) {
    console.error('Error getting progress:', error)
    return null
  }
})

ipcMain.handle('db:updateProgress', async (event, nodeId, status) => {
  if (!db) return false
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO node_progress (id, status, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `)
    stmt.run(nodeId, status)
    return true
  } catch (error) {
    console.error('Error updating progress:', error)
    return false
  }
})

ipcMain.handle('db:getAllProgress', async () => {
  if (!db) return []
  try {
    const stmt = db.prepare('SELECT * FROM node_progress')
    return stmt.all()
  } catch (error) {
    console.error('Error getting all progress:', error)
    return []
  }
})

ipcMain.handle('db:resetProgress', async () => {
  if (!db) return false
  try {
    db.exec('DELETE FROM node_progress')
    return true
  } catch (error) {
    console.error('Error resetting progress:', error)
    return false
  }
})

function createWindow() {
  // Inicializar base de datos
  initializeDatabase()
  
  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    icon: path.join(__dirname, '../icon.png'), // Usar icon.png como icono principal
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js') // Agregar preload script
    },
    titleBarStyle: 'default',
    show: false, // No mostrar hasta que esté listo
    backgroundColor: '#282a36' // Color de fondo mientras carga
  })

  // Configurar el menú
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de',
          click() {
            require('electron').shell.openExternal('https://github.com/FabianQ-S/Roadmap-Interactivo-de-VITE-y-REACT')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Cargar la aplicación
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    // Abrir DevTools en desarrollo
    mainWindow.webContents.openDevTools()
  } else {
    // En producción, cargar desde el directorio de recursos de Electron
    const indexPath = path.join(__dirname, '../dist/index.html')
    console.log('Cargando desde:', indexPath)
    
    // Verificar si el archivo existe
    const fs = require('fs')
    if (fs.existsSync(indexPath)) {
      console.log('Archivo index.html encontrado')
      mainWindow.loadFile(indexPath)
    } else {
      console.error('Archivo index.html no encontrado en:', indexPath)
      // Intentar ruta alternativa
      const altPath = path.join(process.resourcesPath, 'app/dist/index.html')
      console.log('Intentando ruta alternativa:', altPath)
      if (fs.existsSync(altPath)) {
        mainWindow.loadFile(altPath)
      } else {
        console.error('No se pudo encontrar index.html en ninguna ubicación')
        // Mostrar un mensaje de error
        mainWindow.loadURL('data:text/html,<h1>Error: No se pudo cargar la aplicación</h1><p>Ruta buscada: ' + indexPath + '</p>')
      }
    }
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Abrir DevTools en producción para depurar
    if (!isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Manejar el cierre de la ventana
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Esta función se ejecuta cuando Electron ha terminado de inicializarse
app.whenReady().then(createWindow)

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  // En macOS es común que las aplicaciones permanezcan activas hasta que el usuario las cierre explícitamente
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común recrear la ventana cuando el icono del dock es clickeado
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Prevenir navegación a URLs externas
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationURL) => {
    navigationEvent.preventDefault()
    require('electron').shell.openExternal(navigationURL)
  })
})
