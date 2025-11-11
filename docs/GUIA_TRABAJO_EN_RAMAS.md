# 🌿 Guía de Trabajo en Ramas - Sistema de Acueducto

## 👥 Integrantes y Ramas Asignadas

| Integrante | Rama | Módulo Asignado |
|------------|------|-----------------|
| Bryan | `Bryan` | Predios |
| Natalie | `Natalie` | Usuarios |
| Camilo | `Camilo` | Matrículas |
| German | `German` | Solicitudes |
| Victor | `Victor` | Facturas y Pagos |

---

## 🚀 Pasos Iniciales (TODOS)

### 1. Clonar el Repositorio (si aún no lo has hecho)

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Cambiar a tu Rama Asignada

```bash
# Ejemplo para Bryan:
git checkout Bryan

# Ejemplo para Natalie:
git checkout Natalie

# Y así sucesivamente...
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 4. Configurar Variables de Entorno

Asegúrate de tener los archivos `.env` configurados:

**Backend** (`backend/.env`):
```env
SUPABASE_URL=<URL_DE_SUPABASE>
SUPABASE_KEY=<KEY_DE_SUPABASE>
PORT=3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=https://acueducto-2.onrender.com/api
```

### 5. Iniciar el Proyecto

```bash
# Desde la raíz del proyecto, en una terminal:
cd backend
npm run dev

# En otra terminal:
cd frontend
npm run dev
```

El frontend estará en: `http://localhost:5173`
El backend estará en: `http://localhost:3000`

---

## 📋 Instrucciones por Módulo

### 🏠 Bryan - Módulo de Predios

**Archivos a modificar:**
- `frontend/src/pages/PrediosPage.jsx`
- `frontend/src/services/prediosService.js`

**Campos del formulario:**
- Dirección (texto, requerido)
- Propietario CC (número, requerido)
- Teléfono (texto)
- Correo (email)
- Tipo (select: Residencial, Comercial, Industrial)
- Fecha de Registro (date)

**Tareas:**
1. Implementar las funciones CRUD en `prediosService.js`
2. Crear el formulario de creación/edición en `PrediosPage.jsx`
3. Implementar la tabla para listar predios
4. Agregar validaciones de formulario
5. Manejar estados de loading y errores

**Referencia:** Usa `MantenimientosPage.jsx` como ejemplo completo

---

### 👤 Natalie - Módulo de Usuarios

**Archivos a modificar:**
- `frontend/src/pages/UsuariosPage.jsx`
- `frontend/src/services/usuariosService.js`

**Campos del formulario:**
- CC (número, requerido, único)
- Nombre (texto, requerido)
- Apellido (texto, requerido)
- Teléfono (texto)
- Correo (email, requerido)
- Contraseña (password, solo al crear)
- Rol (select: Admin, Usuario)

**Tareas:**
1. Implementar las funciones CRUD en `usuariosService.js`
2. Crear el formulario de creación/edición en `UsuariosPage.jsx`
3. Implementar la tabla para listar usuarios
4. Agregar validaciones (email válido, CC único)
5. Ocultar contraseñas en la tabla
6. Manejar estados de loading y errores

**Referencia:** Usa `MantenimientosPage.jsx` como ejemplo completo

---

### 📜 Camilo - Módulo de Matrículas

**Archivos a modificar:**
- `frontend/src/pages/MatriculasPage.jsx`
- `frontend/src/services/matriculasService.js`

**Campos del formulario:**
- Código Matrícula (texto, requerido, único)
- ID Predio (select, requerido - debe cargar predios existentes)
- Estado (select: Activa, Inactiva, Suspendida)
- Fecha de Registro (date)

**Tareas:**
1. Implementar las funciones CRUD en `matriculasService.js`
2. Crear el formulario de creación/edición en `MatriculasPage.jsx`
3. Implementar selector de predios (cargar desde API)
4. Implementar la tabla para listar matrículas
5. Mostrar información del predio asociado
6. Agregar badges de color según estado
7. Manejar estados de loading y errores

**Nota especial:** Necesitarás hacer una llamada adicional a la API de predios para el selector.

**Referencia:** Usa `MantenimientosPage.jsx` como ejemplo completo

---

### 🔧 German - Módulo de Solicitudes

**Archivos a modificar:**
- `frontend/src/pages/SolicitudesPage.jsx`
- `frontend/src/services/solicitudesService.js`
- `frontend/src/components/SolicitudesList.jsx` (ya existe, puedes mejorarlo)

**Campos del formulario:**
- ID Mantenimiento (select, requerido - cargar mantenimientos)
- Código Matrícula (select, requerido - cargar matrículas)
- Estado (select: Pendiente, En Proceso, Completada, Cancelada)
- Observaciones (textarea)
- Prioridad (select: Baja, Media, Alta, Urgente)
- Fecha de Solicitud (date)

**Tareas:**
1. Implementar las funciones CRUD en `solicitudesService.js`
2. Crear el formulario de creación/edición en `SolicitudesPage.jsx`
3. Implementar selectores para mantenimientos y matrículas
4. Implementar la tabla para listar solicitudes
5. Agregar badges de color según estado y prioridad
6. Implementar filtros por estado
7. Manejar estados de loading y errores

**Nota especial:** Este módulo es clave para el sistema. Necesitarás cargar datos de mantenimientos y matrículas.

**Referencia:** Usa `MantenimientosPage.jsx` como ejemplo completo

---

### 💰 Victor - Módulos de Facturas y Pagos

**Archivos a modificar:**
- `frontend/src/pages/FacturasPage.jsx`
- `frontend/src/services/facturasService.js`
- `frontend/src/pages/PagosPage.jsx`
- `frontend/src/services/pagosService.js`

#### Facturas

**Campos del formulario:**
- Código Matrícula (select, requerido)
- Fecha de Creación (date, requerido)
- Fecha de Vencimiento (date, requerido)
- Valor (número, requerido)
- Estado (select: Pendiente, Pagada, Vencida, Anulada)
- URL del PDF (texto, opcional)

**Tareas:**
1. Implementar las funciones CRUD en `facturasService.js`
2. Crear el formulario de creación/edición en `FacturasPage.jsx`
3. Implementar selector de matrículas
4. Implementar la tabla para listar facturas
5. Agregar badges de color según estado
6. Mostrar alertas para facturas vencidas
7. Agregar botón para ver/descargar PDF

#### Pagos

**Campos del formulario:**
- ID Factura (select, requerido - solo facturas pendientes)
- Fecha de Pago (date, requerido)
- Método de Pago (select: Efectivo, Transferencia, Tarjeta)
- Valor (número, requerido - debe coincidir con factura)

**Tareas:**
1. Implementar las funciones CRUD en `pagosService.js`
2. Crear el formulario de registro de pago en `PagosPage.jsx`
3. Implementar selector de facturas pendientes
4. Implementar la tabla para listar pagos
5. Mostrar información de la factura asociada
6. Validar que el valor coincida con la factura
7. Actualizar estado de factura al registrar pago

**Nota especial:** Pagos tiene relación 1:1 con Facturas. Al crear un pago, la factura debe cambiar a estado "Pagada".

**Referencia:** Usa `MantenimientosPage.jsx` como ejemplo completo

---

## 🎯 Patrón de Implementación (TODOS)

Sigue este patrón para implementar tu módulo:

### 1. Servicio API (`services/[modulo]Service.js`)

```javascript
import api from "./api";

export const getItems = async () => {
  return await api.get("/ruta");
};

export const getItemById = async (id) => {
  return await api.get(`/ruta/${id}`);
};

export const createItem = async (data) => {
  return await api.post("/ruta", data);
};

export const updateItem = async (id, data) => {
  return await api.put(`/ruta/${id}`, data);
};

export const deleteItem = async (id) => {
  return await api.delete(`/ruta/${id}`);
};
```

### 2. Página (`pages/[Modulo]Page.jsx`)

```javascript
import { useState, useEffect } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../services/[modulo]Service";

function ModuloPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    // campos iniciales
  });

  // Cargar datos al montar
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await createItem(formData);
      }
      loadItems();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro?")) {
      try {
        await deleteItem(id);
        loadItems();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ /* valores iniciales */ });
    setEditingItem(null);
    setShowForm(false);
  };

  // Renderizar UI...
}
```

---

## 🎨 Componentes de UI Disponibles

### Botones

```jsx
<button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
  Guardar
</button>

<button className="bg-danger text-white px-4 py-2 rounded hover:bg-danger/90">
  Eliminar
</button>
```

### Badges de Estado

```jsx
<span className="px-2 py-1 rounded text-sm bg-success/20 text-success">
  Activo
</span>

<span className="px-2 py-1 rounded text-sm bg-warning/20 text-warning">
  Pendiente
</span>

<span className="px-2 py-1 rounded text-sm bg-danger/20 text-danger">
  Inactivo
</span>
```

### Inputs de Formulario

```jsx
<input
  type="text"
  value={formData.campo}
  onChange={(e) => setFormData({ ...formData, campo: e.target.value })}
  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
  required
/>
```

### Select

```jsx
<select
  value={formData.estado}
  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
>
  <option value="">Seleccionar...</option>
  <option value="opcion1">Opción 1</option>
  <option value="opcion2">Opción 2</option>
</select>
```

---

## 📝 Flujo de Trabajo con Git

### 1. Antes de Empezar a Trabajar

```bash
# Asegúrate de estar en tu rama
git checkout <tu-rama>

# Actualiza tu rama con los últimos cambios
git pull origin <tu-rama>
```

### 2. Mientras Trabajas

```bash
# Guarda tus cambios frecuentemente
git add .
git commit -m "Descripción clara de lo que hiciste"

# Ejemplo:
git commit -m "Implementar formulario de creación de predios"
git commit -m "Agregar validaciones al formulario de usuarios"
```

### 3. Subir tus Cambios

```bash
# Sube tus cambios a tu rama
git push origin <tu-rama>
```

### 4. Cuando Termines tu Módulo

1. Asegúrate de que todo funcione correctamente
2. Haz commit de todos tus cambios
3. Sube tu rama: `git push origin <tu-rama>`
4. Avisa al equipo que terminaste
5. Se creará un Pull Request para revisar tu código

---

## ✅ Checklist de Completitud

Antes de considerar tu módulo terminado, verifica:

- [ ] Servicio API implementado con todas las funciones CRUD
- [ ] Formulario de creación funcional
- [ ] Formulario de edición funcional
- [ ] Tabla de listado con todos los campos
- [ ] Función de eliminación con confirmación
- [ ] Validaciones de formulario
- [ ] Manejo de estados de loading
- [ ] Manejo de errores con mensajes claros
- [ ] Diseño responsive (se ve bien en móvil)
- [ ] Código comentado y limpio
- [ ] Probado en el navegador sin errores en consola

---

## 🆘 Ayuda y Recursos

### Documentación del Proyecto

- `docs/FRONTEND_README.md` - Documentación completa del frontend
- `docs/QUICK_START.md` - Guía rápida de inicio
- `docs/ESTRUCTURA_PROYECTO.md` - Estructura del proyecto
- `docs/API_DOCUMENTATION.md` - Documentación de la API

### Ejemplo Completo

El módulo de **Mantenimientos** está completamente implementado. Úsalo como referencia:
- `frontend/src/pages/MantenimientosPage.jsx`
- `frontend/src/services/mantenimientosService.js`

### Endpoints de la API

Todos los endpoints siguen el patrón REST:

```
GET    /api/[modulo]       - Listar todos
GET    /api/[modulo]/:id   - Obtener uno
POST   /api/[modulo]       - Crear
PUT    /api/[modulo]/:id   - Actualizar
DELETE /api/[modulo]/:id   - Eliminar
```

### Colores del Tema

El proyecto usa un sistema de colores personalizado. Consulta `frontend/src/theme/colors.css` para ver todos los colores disponibles.

---

## 🐛 Problemas Comunes

### Error: "Cannot find module"
```bash
cd frontend
npm install
```

### Error: "Port 5173 is already in use"
```bash
# Mata el proceso anterior
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# O cambia el puerto en vite.config.js
```

### Error de CORS
Verifica que el backend esté corriendo y que la URL en `frontend/src/services/api.js` sea correcta.

### Cambios no se reflejan
```bash
# Detén el servidor (Ctrl+C)
# Limpia la caché
npm run dev
```

---

## 📞 Contacto

Si tienes dudas o problemas:
1. Revisa la documentación en la carpeta `docs/`
2. Consulta el módulo de Mantenimientos como ejemplo
3. Pregunta en el grupo del equipo
4. Revisa la consola del navegador para errores

---

## 🎉 ¡Éxito!

Recuerda:
- Trabaja solo en tu rama asignada
- Haz commits frecuentes con mensajes claros
- Prueba tu código antes de hacer push
- Usa el módulo de Mantenimientos como referencia
- Pide ayuda si la necesitas

¡Buena suerte con tu módulo! 🚀
