Backend 2 - Entrega Final

Proyecto Ecommerce Backend

Servidor backend desarrollado con Node.js, Express y MongoDB aplicando autenticación con JWT, autorización por roles, arquitectura en capas con DAO, Repository y Service, y funcionalidades avanzadas como recuperación de contraseña por email.

Tecnologías utilizadas

Node.js

Express

MongoDB / Mongoose

Passport.js

JWT (JSON Web Tokens)

Nodemailer

Ethereal Email (para pruebas de mailing)

Arquitectura del proyecto

El proyecto utiliza una arquitectura modular separando responsabilidades en distintas capas:

src/
│
├── config/          # Configuración de passport y mailer
├── controllers/     # Controladores de las rutas
├── dao/             # Acceso directo a base de datos
│   └── mongo/
├── dto/             # Data Transfer Objects
├── middlewares/     # Middlewares de autorización
├── models/          # Modelos de Mongoose
├── repositories/    # Capa repository (patrón repository)
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── utils/           # Utilidades (hash, jwt, etc)
│
└── app.js           # Punto de entrada del servidor

Variables de entorno

El proyecto utiliza variables de entorno definidas en un archivo .env.

Crear un archivo .env en la raíz del proyecto con la siguiente estructura:

PORT=8080

MONGO_URL=
MONGO_ATLAS_URL=

MONGO_TARGET=ATLAS

SECRET_SESSION=clave_secreta
JWT_SECRET=clave_secreta_jwt

NODE_ENV=development

MAIL_USER=
MAIL_PASS=
MAIL_FROM=

RESET_BASE_URL=http://localhost:8080

⚠️ El archivo .env no se incluye en el repositorio por seguridad.

Sistema de autenticación

El sistema utiliza Passport + JWT para autenticación.

Al hacer login se genera un token JWT que se almacena en una cookie: access_token.

Este token permite acceder a rutas protegidas.

Roles de usuario

El sistema define dos roles:

user

Puede:

agregar productos al carrito

realizar compras

admin

Puede:

crear productos

actualizar productos

eliminar productos

Endpoints principales
Sessions

Registro de usuario

POST /api/sessions/register

Login

POST /api/sessions/login

Obtener usuario actual

GET /api/sessions/current

Recuperación de contraseña

POST /api/sessions/forgot-password

Reset de contraseña

POST /api/sessions/reset-password
Products

Obtener productos

GET /api/products

Crear producto (admin)

POST /api/products

Actualizar producto (admin)

PUT /api/products/:pid

Eliminar producto (admin)

DELETE /api/products/:pid
Carts

Obtener carrito

GET /api/carts/:cid

Agregar producto al carrito

POST /api/carts/:cid/product/:pid

Finalizar compra

POST /api/carts/:cid/purchase

Recuperación de contraseña

El sistema incluye un mecanismo de recuperación de contraseña:

El usuario solicita recuperación con su email

POST /api/sessions/forgot-password

Se envía un correo con un link de recuperación

El link contiene un token válido por 1 hora

El usuario puede restablecer su contraseña

POST /api/sessions/reset-password

Para pruebas se utiliza Ethereal Email, que permite visualizar los correos sin utilizar un servidor real.

Seguridad implementada

El proyecto incluye:

Hash de contraseñas con bcrypt

JWT para autenticación

Middleware de autorización por roles

DTO para evitar enviar información sensible

Expiración de tokens de recuperación

Bloqueo para evitar reutilizar la contraseña anterior

Notas

El proyecto utiliza Ethereal Email para simular el envío de correos en el sistema de recuperación de contraseña.



