# QRing Web App

Aplicación web independiente para el sistema de timbres QRing.

## 🚀 Características

- **Página Pública**: Interfaz para visitantes que escanean códigos QR
- **Panel de Administración**: Gestión de edificios, estructura y timbres
- **Wizard de Configuración**: Asistente para configurar nuevos edificios
- **Sistema de Timbres**: Gestión de timbres por piso y departamento
- **Integración WhatsApp**: Contacto directo con residentes

## 📁 Estructura del Proyecto

```
apps/web/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   │   ├── panel/         # Panel principal de admin
│   │   ├── wizard-estructura/  # Wizard de configuración
│   │   └── configuracion-timbres/  # Configuración de timbres
│   ├── api/               # API Routes
│   │   ├── admin/         # Endpoints administrativos
│   │   ├── publico/       # Endpoints públicos
│   │   └── tienda/        # Endpoints de la tienda
│   ├── components/        # Componentes reutilizables
│   ├── tienda/            # Página de la tienda
│   ├── page.tsx           # Página pública principal (raíz)
│   └── inicio/            # Página de inicio (admin)
├── lib/                   # Utilidades y configuración
│   └── prisma.ts          # Cliente de Prisma
├── prisma/                # Esquema de base de datos
│   └── schema.prisma      # Esquema de Prisma
├── public/                # Archivos estáticos
└── borrar/                # Archivos movidos (no utilizados)
```

## 🛠️ Tecnologías

- **Next.js 15** - Framework de React
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos local

## 📋 Páginas Principales

### 1. **Página Pública** (`/`)
- Interfaz para visitantes
- Selección de piso y departamento
- Generación de códigos QR
- Botones de Tienda y Acceso

### 2. **Panel de Administración** (`/admin`)
- Dashboard principal
- Acceso al wizard de configuración
- Navegación a funciones administrativas

### 3. **Wizard de Configuración** (`/admin/wizard-estructura`)
- Configuración de edificios
- Definición de pisos y departamentos
- Configuración de timbres

### 4. **Configuración de Timbres** (`/admin/configuracion-timbres`)
- Gestión de timbres por IDU
- Asignación de números de teléfono
- Estados de configuración

## 🗄️ Base de Datos

### Modelos Principales

- **Direccion**: Información del edificio
- **Estructura**: Pisos y departamentos
- **Timbre**: Configuración de timbres individuales
- **Venta**: Registro de ventas

### Esquema SQLite

```sql
-- Ejemplo de estructura
Direccion (id, idUnico, nombre, calle, numero, ciudad)
├── Estructura (id, nombre, dptos, orden, direccionId)
└── Timbre (id, nombre, piso, dpto, numero, metodo, estado, esPropio, estadoAsignacion, direccionId)
```

## 🚀 Instalación y Configuración

### 1. **Instalar Dependencias**
```bash
npm install
```

### 2. **Configurar Base de Datos**
```bash
# Crear archivo .env.local con:
DATABASE_URL="file:./dev.db"

# Generar cliente de Prisma
npm run db:generate

# Crear base de datos
npm run db:push
```

### 3. **Ejecutar en Desarrollo**
```bash
npm run dev
```

### 4. **Construir para Producción**
```bash
npm run build
npm start
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run db:generate` - Generar cliente de Prisma
- `npm run db:push` - Sincronizar esquema con BD
- `npm run db:studio` - Abrir Prisma Studio

## 🌐 Despliegue en Vercel

### 1. **Preparar el Proyecto**
- Asegurar que todas las dependencias estén en `package.json`
- Configurar variables de entorno en Vercel
- Usar base de datos compatible (PostgreSQL recomendado para producción)

### 2. **Variables de Entorno en Vercel**
```
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

### 3. **Comandos de Build**
```json
{
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

## 📱 Funcionalidades Principales

### **Sistema de Timbres**
- Configuración por piso y departamento
- Estados: libre, asignado, solicitado, configurado
- Integración con WhatsApp para contacto

### **Wizard de Configuración**
- Configuración paso a paso de edificios
- Definición de estructura
- Configuración de timbres

### **Panel de Administración**
- Gestión de múltiples edificios por IDU
- Configuración de timbres
- Acceso a funcionalidades administrativas

## 🔒 Autenticación

- Sistema de roles: User, Admin, SuperAdmin
- Protección de rutas administrativas
- Guardado de sesión en localStorage

## 📞 Integración WhatsApp

- Formateo automático de números argentinos
- Apertura directa de chat/call
- Validación de números de teléfono

## 🗂️ Archivos Movidos a `borrar/`

Los siguientes archivos fueron movidos por no ser utilizados en la versión independiente:

- `admin/diagnostico/` - Página de diagnóstico de ventas
- `admin/hoja-datos/` - Hoja de datos de ventas
- `admin/invitaciones/` - Sistema de invitaciones
- `admin/dashboard/` - Dashboard administrativo
- `login/` - Sistema de login
- `demo/` - Páginas de demostración
- `acceso/` - Sistema de acceso público
- `utils/` - Utilidades no utilizadas
- `scripts/` - Scripts de desarrollo

## 📋 Estado del Proyecto

✅ **Completado**
- Página pública funcional
- Panel de administración
- Wizard de configuración
- Sistema de timbres
- API REST funcional
- Base de datos independiente

🔄 **En Desarrollo**
- Optimizaciones de rendimiento
- Mejoras de UI/UX

📝 **Pendiente**
- Tests automatizados
- Documentación de API
- Logs de auditoría

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para soporte técnico, contactar al equipo de desarrollo.
