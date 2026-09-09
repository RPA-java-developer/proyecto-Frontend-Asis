# ASISYA · Frontend

CRUD de Products, Categories y Suppliers consumiendo la API ASISYA (.NET / MySQL).

## Instalación

```bash
npm install
```

## Configuración

Copia `.env.example` a `.env` y ajusta la URL si tu API corre en otro puerto:

```bash
cp .env.example .env
```

Verifica el puerto real de tu backend al correr `dotnet run` (línea "Now
listening on..."). Si usas HTTPS en el backend, ajusta también el
protocolo en `VITE_API_BASE_URL`.

## Habilitar CORS en el backend

Asegúrate de que tu `Program.cs` en ASISYA tenga la política CORS activa
(ya debería estar, la agregamos antes) apuntando a `http://localhost:5173`
o usando `AllowAnyOrigin()` en desarrollo.

## Ejecutar

```bash
npm run dev
```

Abre http://localhost:5173

## Estructura

Carpetas del proyecto


![Logotipo del proyecto](imagenes/estructura.png)



## Scripts para la Base de Datos

Aquí se encuentran los diferentes scripts necesarios para la creación de la base de datos y las tablas principales.

[scripts base de datos:](Base_datos_scripts.md)



## Instrucciones para el proyecto frontend

En este documento se presentan las instrucciones para el uso y funcionamiento de la aplicación.

[Ver instrucciones de uso:](Instrucciones-proyecto-frontend.md)


## Pruebas integración para el proyecto frontend

Se evidencian las pruebas sobre componentes del proyecto frontend.

[Ver pruebas de integración:](Pruebas_integracion.md)



