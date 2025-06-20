# Ejecutables

Esta carpeta está destinada para los ejecutables compilados de la aplicación, pero **no se incluyen en el repositorio** por su gran tamaño.

## Cómo generar los ejecutables

Para crear tus propios ejecutables, sigue estos pasos:

### Prerrequisitos
```bash
npm install
```

### Para Windows (.exe)
```bash
npm run dist-win
```

### Para Linux (AppImage)
```bash
npm run dist-linux
```

### Para todas las plataformas
```bash
npm run dist
```

## Ubicación
Los ejecutables se generarán en `dist-electron/`:
- Windows: `Roadmap Interactivo JavaScript Vue-1.0.0.exe`
- Linux: `Roadmap Interactivo JavaScript Vue-1.0.0.AppImage`

## Notas
- Los ejecutables tienen ~85-110MB de tamaño
- Se requiere Wine en Linux para compilar ejecutables de Windows

