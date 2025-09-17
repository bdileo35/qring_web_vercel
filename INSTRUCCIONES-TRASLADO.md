# 📋 INSTRUCCIONES PARA TRASLADO DEL PROYECTO

## 🎯 Objetivo
Mover la carpeta `/web` a un nuevo repositorio independiente en GitHub y desplegarla en Vercel.

## 📁 Estructura Final del Proyecto

```
apps/web/                    # ← ESTA CARPETA COMPLETA
├── app/                     # Aplicación Next.js
│   ├── admin/              # Panel administrativo
│   ├── api/                # API Routes
│   ├── components/         # Componentes React
│   ├── tienda/             # Página de tienda
│   ├── page.tsx            # Página pública (raíz)
│   └── inicio/             # Página de inicio admin
├── lib/                     # Utilidades
├── prisma/                  # Esquema de base de datos
├── public/                  # Archivos estáticos
├── package.json             # Dependencias independientes
├── next.config.ts           # Configuración Next.js
├── tsconfig.json            # Configuración TypeScript
├── README.md                # Documentación completa
└── env.example              # Variables de entorno
```

## 🗂️ Archivos Movidos a `borrar/` (NO INCLUIR)

Los siguientes archivos NO deben incluirse en el nuevo repositorio:

- `admin/diagnostico/` - Página de diagnóstico (no utilizada)
- `admin/hoja-datos/` - Hoja de datos (no utilizada)  
- `admin/invitaciones/` - Sistema de invitaciones (no utilizado)
- `admin/dashboard/` - Dashboard (no utilizado)
- `login/` - Sistema de login (no utilizado)
- `demo/` - Páginas de demostración (no utilizadas)
- `acceso/` - Sistema de acceso (no utilizado)
- `utils/` - Utilidades (no utilizadas)
- `scripts/` - Scripts de desarrollo (no utilizados)

## 🚀 Pasos para el Traslado

### 1. **Crear Nuevo Repositorio en GitHub**
```bash
# URL del nuevo repo:
https://github.com/bdileo35/mono_web
```

### 2. **Copiar Carpeta Web a Pendrive**
```bash
# Copiar TODA la carpeta apps/web/ a tu pendrive
# Asegurarse de que incluya:
# - Todos los archivos de la estructura final
# - NO incluir la carpeta borrar/
# - NO incluir node_modules/
```

### 3. **Clonar Nuevo Repositorio**
```bash
git clone https://github.com/bdileo35/mono_web.git
cd mono_web
```

### 4. **Copiar Archivos del Pendrive**
```bash
# Copiar todos los archivos de apps/web/ al nuevo repo
# Excluir la carpeta borrar/
```

### 5. **Configurar Base de Datos**
```bash
# Crear archivo .env.local:
DATABASE_URL="file:./dev.db"
NODE_ENV="development"

# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Crear base de datos
npm run db:push
```

### 6. **Probar Localmente**
```bash
npm run dev
# Verificar que funcione en http://localhost:3000
```

### 7. **Commit y Push**
```bash
git add .
git commit -m "Initial commit: QRing Web App"
git push origin main
```

## 🌐 Despliegue en Vercel

### 1. **Conectar Repositorio**
- Ir a [vercel.com](https://vercel.com)
- Conectar con el repositorio `bdileo35/mono_web`

### 2. **Configurar Variables de Entorno**
```
DATABASE_URL="postgresql://..."  # Base de datos PostgreSQL
NODE_ENV="production"
```

### 3. **Configurar Comandos de Build**
```json
{
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

### 4. **Desplegar**
- Vercel detectará automáticamente que es Next.js
- El build debería completarse exitosamente

## 🔧 Configuraciones Importantes

### **Base de Datos**
- **Desarrollo**: SQLite local (`file:./dev.db`)
- **Producción**: PostgreSQL en Vercel

### **Dependencias Críticas**
- `@prisma/client` - ORM de base de datos
- `next` - Framework de React
- `react` y `react-dom` - Biblioteca de UI
- `typescript` - Tipado estático

### **Scripts Disponibles**
- `npm run dev` - Desarrollo local
- `npm run build` - Construcción para producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar esquema

## ✅ Verificaciones Post-Traslado

### **Funcionalidades a Verificar**
1. ✅ Página pública carga correctamente
2. ✅ Panel de administración funciona
3. ✅ Wizard de configuración opera
4. ✅ API endpoints responden
5. ✅ Base de datos se conecta
6. ✅ QR codes se generan
7. ✅ Integración WhatsApp funciona

### **Rutas a Verificar**
- `/` - Página pública principal
- `/admin` - Panel de administración
- `/admin/wizard-estructura` - Wizard de configuración
- `/admin/panel` - Panel principal de admin
- `/tienda` - Página de tienda

## 🚨 Posibles Problemas y Soluciones

### **Error de Prisma**
```bash
# Si hay error de Prisma:
npm run db:generate
npm run db:push
```

### **Error de Build en Vercel**
- Verificar que `prisma` esté en `devDependencies`
- Asegurar que `@prisma/client` esté en `dependencies`

### **Error de Base de Datos**
- Verificar variables de entorno
- Asegurar que la base de datos esté accesible

## 📱 Funcionalidades del Sistema

### **Para Visitantes (Página Pública)**
- Escanear QR del edificio
- Seleccionar piso y departamento
- Contactar residente via WhatsApp
- Acceder a tienda y funciones

### **Para Administradores**
- Configurar edificios nuevos
- Gestionar estructura de pisos
- Configurar timbres individuales
- Asignar números de teléfono

### **Sistema de Timbres**
- Estados: libre, asignado, solicitado, configurado
- Configuración por piso y departamento
- Integración automática con WhatsApp

## 🎉 ¡Listo para Desplegar!

El proyecto está completamente preparado para ser:
1. **Copiado** a un pendrive
2. **Subido** al nuevo repositorio
3. **Desplegado** en Vercel
4. **Funcionando** de forma independiente

## 📞 Soporte

Si hay problemas durante el traslado:
1. Verificar que todos los archivos estén copiados
2. Revisar las variables de entorno
3. Verificar que las dependencias estén instaladas
4. Consultar los logs de error en Vercel
