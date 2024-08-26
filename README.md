# E-commerce Order API

Esta API proporciona endpoints para gestionar pedidos en una plataforma de comercio electrónico. Permite a los usuarios crear pedidos, ver detalles de pedidos específicos, listar sus pedidos y a los administradores actualizar el estado de los pedidos.

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/Aavz321/prueba_tecnica.git
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

```
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
SALT_ROUNDS=10
PORT=3000
```

4. Inicia el servidor:

```bash
npm run start:mongodb
```

## Uso de la API

### Autenticación

Todas las rutas, excepto el registro y el login, requieren autenticación. Usa el token JWT proporcionado en la respuesta de login como una cookie `access_token`.

### Endpoints

#### Registro de usuario

- **POST** `/auth/register`
- Body: `{ "username": "string", "password": "string" }`
- Respuesta: `{ "message": "User registered successfully" }`

#### Login de usuario

- **POST** `/auth/login`
- Body: `{ "username": "string", "password": "string" }`
- Respuesta: `{ "message": "User successfully logged in" }`
- Esta respuesta incluirá una cookie `access_token` con el JWT

#### Crear un pedido

- **POST** `/api/orders`
- Body:

```json
{
  "items": [
    { "product_id": "string", "quantity": number }
  ],
  "shipping_address": "string"
}
```

- Respuesta: `{ "message": "Order created successfully", "order": Order }`

#### Ver un pedido específico

- **GET** `/api/orders/{orderId}`
- Respuesta: `{ "order": Order }`

#### Listar pedidos de un usuario

- **GET** `/api/users/{userId}/orders`
- Query params:
- `status`: (opcional) filtrar por estado ("pendiente", "enviado", "completado")
- `page`: (opcional) número de página
- `limit`: (opcional) número de resultados por página
- Respuesta: `{ "orders": [Order], "page": number, "limit": number, "totalPages": number, "totalOrders": number }`

#### Actualizar el estado de un pedido (solo admin)

- **PATCH** `/api/orders/{orderId}`
- Body: `{ "status": "pendiente" | "enviado" | "completado" }`
- Respuesta: `{ "order": Order }`

## Seguridad

- Autenticación basada en JWT
- Passwords encriptados con bcrypt
- CORS configurado para permitir solo dominios autorizados
- Validación de datos de entrada para prevenir inyecciones

## Logging

La API implementa un sistema de logging que registra:

- Intentos de acceso (exitosos y fallidos)
- Creación y modificación de pedidos
- Otras acciones relevantes

Los logs se almacenan en la base de datos MongoDB para su posterior análisis.

## Pruebas

Para ejecutar las pruebas:

Habilitar el test en index.js Línea 34

```
return app;
```

y deshabilitar console.logs()

```
// const PORT = process.env.PORT ?? 1234;

// app.listen(PORT, () => {
//   console.log(`Server listening on port http://localhost:${PORT}`);
// });
```

```bash
npm test
```

## Contacto

Tu Nombre - tu@email.com

Link del proyecto: [https://github.com/tu-usuario/tu-repo](https://github.com/tu-usuario/tu-repo)
