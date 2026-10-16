# Colores Tortas Decoradas · Frontend

Sitio web y tienda online de [Colores Tortas Decoradas](https://colorestortasdecoradas.com.ar), una pastelería de Almagro (CABA). Está en producción y lo usa el negocio para recibir y cobrar pedidos.

Backend: [tortas-decoradas-backend](../tortas-decoradas-backend) (Java + Spring Boot, arquitectura hexagonal).

<!-- Agregar capturas: docs/inicio.png, docs/producto.png, docs/admin.png -->

## Qué hace

- Catálogo con buscador, filtros y paginación.
- Armado de tortas a medida: forma, pisos, bizcochuelo, rellenos y alérgenos, con el precio actualizado al instante.
- Carrito, elección de fecha de entrega en calendario y cálculo de envío por dirección.
- Pago con Mercado Pago y pantalla de resultado del pago.
- Registro con verificación de email, inicio de sesión y recuperación de cuenta.
- Perfil e historial de pedidos del cliente.
- Panel de administración: productos, precios, sabores, carrusel, agenda, cupo diario, perfiles, facturas y notas de crédito.
- Páginas legales: términos, privacidad, cambios y devoluciones.

## Stack

| | |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4, Flowbite React |
| Estado | Zustand, SWR |
| Imágenes | Cloudinary (next-cloudinary) |
| Pruebas | Vitest, Testing Library |
| Despliegue | Docker en servidor Linux (Ubuntu) |

## Estructura

```
src/
├── app/          Páginas (rutas de Next.js): productos, checkout, pago, perfil, admin, legales
├── features/     Lógica por funcionalidad: auth, carrito, productos, configuracion, factura
├── componenets/  Componentes compartidos: navbar, footer, calendario, buscador
└── utils/        Cliente HTTP y utilidades
```

El navegador siempre habla con el mismo dominio del frontend: Next reenvía `/api/*` al backend con `rewrites`, así el backend no necesita ser público ni tener CORS abierto.

## Correr en local

Requisitos: Node 22 y el backend corriendo.

```bash
npm install
cp .env.example .env.local   # completar los valores
npm run dev
```

Queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `BACKEND_URL` | URL del backend. Se usa al compilar, así que tiene que estar definida antes de `npm run build`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta de Cloudinary |

## Con Docker

```bash
docker build --build-arg BACKEND_URL=http://backend:8080 \
  --build-arg NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud \
  -t tortas-frontend .
docker run -p 3000:3000 tortas-frontend
```

## Pruebas

```bash
npm test
```

## Autor

Luis Alberto Cortes · [GitHub](https://github.com/luis19842021)
