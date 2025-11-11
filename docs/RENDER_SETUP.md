# Configuración de Render para el Backend

## Variables de Entorno Requeridas

En tu servicio de Render, debes configurar las siguientes variables de entorno:

### 1. SUPABASE_URL
```
https://sjllenxfoowyhiyeabxh.supabase.co
```

### 2. SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqbGxlbnhmb293eWhpeWVhYnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NDc3MjUsImV4cCI6MjA3NzMyMzcyNX0.FrrJmcUD-e_V_s36DECO7VNay3CB-LAK-FbbVQWcLGg
```

### 3. NODE_ENV (opcional)
```
production
```

## Pasos para Configurar en Render

1. Ve a tu servicio en Render Dashboard
2. Click en "Environment" en el menú lateral
3. Agrega cada variable de entorno:
   - Key: `SUPABASE_URL`
   - Value: (copia el valor de arriba)
4. Repite para `SUPABASE_ANON_KEY`
5. Click en "Save Changes"
6. Render automáticamente redesplegará tu servicio

## Verificar que Funciona

Una vez configurado, prueba estos endpoints:

### Health Check
```
https://acueducto-2.onrender.com/health
```
Debe retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "env": {
    "nodeEnv": "production",
    "port": 10000,
    "supabaseConfigured": true
  }
}
```

### API Root
```
https://acueducto-2.onrender.com/
```

### Usuarios
```
https://acueducto-2.onrender.com/api/usuarios
```

## Comandos de Build en Render

Asegúrate de que tu servicio tenga:

- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Troubleshooting

Si sigues viendo errores 500:

1. Revisa los logs en Render Dashboard → Logs
2. Verifica que `supabaseConfigured: true` en `/health`
3. Asegúrate de que las tablas existen en Supabase
4. Verifica que RLS (Row Level Security) esté deshabilitado o configurado correctamente en Supabase
