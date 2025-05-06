# 🧾 Compass Reservation - API RESTful

[![Node.js Version](https://img.shields.io/badge/Node.js-22.14.0-brightgreen)](https://nodejs.org/) [![NestJS](https://img.shields.io/badge/NestJS-11.0.7-red?logo=nestjs&logoColor=white)](https://nestjs.com/) [![Swagger](https://img.shields.io/badge/Swagger-11.1.5-darkgreen?logo=swagger)](https://swagger.io/)

## 📘 Description

The **Compass Reservation API** is a RESTful application designed to manage **space and resource reservations** for clients.

Built using **NestJS** with **TypeScript**, it utilizes a **SQLite** database managed by **Prisma ORM**, and features automatic documentation with **Swagger**.

## 🧩 API Modules

The API provides full **CRUD** functionality and business rules for the following domains:

- **Users**: Authentication and access control
- **Clients**: Client registration and management
- **Spaces**: Available locations for reservation
- **Resources**: Items or equipment available for booking
- **Reservations**: Booking management with conflict validation

### In this project, you can access various sections. Click the links below to navigate:

- [Endpoints](#endpoints)
- [Authentication](#authentication)


## 💻 Technologies

### Backend

![NestJS](https://img.shields.io/badge/NestJS-11.0.7-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript&logoColor=white)

### ORM & Database

![Prisma](https://img.shields.io/badge/Prisma-6.7.0-%23000000.svg?style=for-the-badge&logo=prisma&logoColor=white) ![SQLite](https://img.shields.io/badge/SQLite-5.1.7-%23316192.svg?style=for-the-badge&logo=sqlite&logoColor=white)

### Documentation

![Swagger](https://img.shields.io/badge/Swagger-11.1.5-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## 📋 Prerequisites

- **Node.js** installed (v18 or higher recommended)
- **Package manager** (_npm_ or _yarn_)

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following settings:

```env
DATABASE_URL="file:./compass_reservation.db"

APP_URL=http://localhost:3000
PORT=3000

DEFAULT_USER_NAME=user
DEFAULT_USER_EMAIL=user@gmail.com
DEFAULT_USER_PASSWORD=Us3r@1234
DEFAULT_USER_PHONE=+55 (81) 99999-9999

NODE_ENV=development

MAIL_USER=teste@gmail.com
MAIL_PASS=teste
EMAIL_ENABLED=true

JWT_SECRET=mysecretkey
JWT_EXPIRATION=1d

DEFAULT_ADMIN_NAME=admin
DEFAULT_ADMIN_EMAIL=admin@gmail.com
DEFAULT_ADMIN_PASSWORD=Adm1n@1234
DEFAULT_ADMIN_PHONE=+55 (81) 99996-9999
```

## 🚀 How to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/Xcode-Compass/ANMAR25_D02_COMPASSRESERVATION.git
cd ANMAR25_D02_COMPASSRESERVATION
```

2. Install dependencies:

```bash
npm install
```

3. Run migrations:

```bash
npx prisma migrate dev
```

4. Start the project in development mode:

```bash
npm run dev
```

#### Npm Run Script's:

Recommended use `Npm run seed` to generate the initial seed with a regular User and an Admin User containing the Login you specified in the .env file.

```
Npm run seed
```

![image](https://github.com/user-attachments/assets/a9a341c6-728d-475c-a5d9-abc8df606d06)


## 📚 Swagger Documentation

Access the `/api` endpoint after starting the server to view the API documentation generated with Swagger.

# Endpoints

- `POST /api/v1/login` - User login
- `POST /api/v1/register` - User registration
- `GET /api/v1/me` - Get current user information
- `POST /api/v1/forget` - Request password reset
- `POST /api/v1/reset` - Reset password
- `GET /api/v1/verify-email` - Verify email address

## Users

- `POST /api/v1/users` - Create a new user
- `PATCH /api/v1/users/:id` - Update user information
- `GET /api/v1/users` - Get list of users
- `GET /api/v1/users/:id` - Get a single user by ID
- `DELETE /api/v1/users/:id` - Delete a user

## Reservations

- `POST /api/v1/reservations` - Create a new reservation
- `GET /api/v1/reservations` - Get list of reservations
- `GET /api/v1/reservations/:id` - Get reservation by ID
- `PATCH /api/v1/reservations/:id` - Update a reservation
- `DELETE /api/v1/reservations/:id` - Delete a reservation

## Spaces

- `POST /api/v1/spaces` - Create a new space
- `GET /api/v1/spaces` - Get list of spaces
- `GET /api/v1/spaces/:id` - Get space by ID
- `PATCH /api/v1/spaces/:id` - Update a space
- `DELETE /api/v1/spaces/:id` - Delete a space

## Resources

- `POST /api/v1/resources` - Create a new resource
- `GET /api/v1/resources` - Get list of resources
- `GET /api/v1/resources/:id` - Get resource by ID
- `PATCH /api/v1/resources/:id` - Update a resource
- `DELETE /api/v1/resources/:id` - Delete a resource

## Clients

- `POST /api/v1/clients` - Create a new client
- `PATCH /api/v1/clients/:id` - Update client information
- `GET /api/v1/clients` - Get list of clients
- `GET /api/v1/clients/:id` - Get client by ID
- `DELETE /api/v1/clients/:id` - Delete a client



## 📁 Folder Structure

```
src/
│
├── auth/             # Authentication and authorization
├── clients/          # Clients module
├── common/           # Reusable filters, interceptors, DTOs, and decorators
├── email/            # Email module
├── interceptors/     # Interceptors for request/response handling
├── prisma/           # Database access service via Prisma
├── reservations/     # Reservations module
├── resources/        # Resources module
├── spaces/           # Spaces module
├── users/            # Users module
└── main.ts           # Application entry point
```
---

# Start the project in development mode:

```bash
npm run dev
```

## Server initializate in `Localhost:3000`

### First step endpoint's:

* localhost:3000/api/v1/register
 In case you don't use the seed in the .env

# Authentication

## 🔑 Authentication and Token Usage (In case you use the seed)

* localhost:3000/api/v1/login

After a new user registers or after running `Npm run seed`, users can obtain an access token to interact with the API's protected routes.

**Login Flow:**

1.  Use the authentication route (usually `/api/v1/login` with the credentials configured in the `.env` file (for the default seed users) or the credentials of a newly registered user.

    * **Regular User (Seed):** Use the `DEFAULT_USER_EMAIL` and `DEFAULT_USER_PASSWORD` defined in the `.env`.
    * **Administrator (Seed):** Use the `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` defined in the `.env`.
    * **Registered User:** Use the email and password provided during the registration process.
      
![image](https://github.com/user-attachments/assets/81045a05-98ed-4563-8884-ee6c64833bde)
> (Image example for Admin user)


2.  The response from this route will be a JSON object containing the Admin or Regular `access_token`. Example:

   ![image](https://github.com/user-attachments/assets/e4e64020-0d33-4efe-8da6-0bc778e465fe)
   
> (Image example for Admin user)

**Using the Token:**

To access the API's protected routes, you need to include the `access_token` in the header of your HTTP request. The most common way is by using the **Bearer Token** authentication scheme in the `Authorization` field.

**Example of how to configure in Postman:**

1.  In the "Authorization" tab of your request.
2.  Select the "Bearer Token" type.
3.  In the "Token" field, paste the `access_token` received in the login response.
   
![image](https://github.com/user-attachments/assets/d1f8c968-ffe2-4d7d-b829-039fb969f2ae)

> (Authorization example)

![image](https://github.com/user-attachments/assets/cafa4e1e-4c6d-421f-8e19-d1737e11f6e5)
> (Header example)



After configuring the `Authorization` with the Bearer Token, your requests to protected routes will be authenticated.

**User Roles:**

* **Users with the `USER` role:** Will have access to the functionalities designated for regular users. The token returned for the default user credentials (`DEFAULT_USER_EMAIL`) or a new registered user will contain the `USER` role.

* **Users with the `ADMIN` role:** Will have access to all API functionalities, including administrative routes. The token returned for the default administrator credentials (`DEFAULT_ADMIN_EMAIL`) will contain the `ADMIN` role.

Make sure to store the token securely in your development environment or client application.

## 🤝 Contribution

- Follow Gitflow: `feature/feature-name`, `fix/bug-fix`, etc.
- Use semantic commits (`feat:`, `fix:`, `docs:`)
- Pull Requests (PRs) must include a clear description of changes.

- ## ✒️ Authors - X code

### All Members information

* [Marcelo Plinio ](https://github.com/MarceloPlinio)
* [Thiago Sampaio ](https://github.com/thiagosampaiog)
* [Caio Renan](https://github.com/Caio-Renan)
* [Alisson Oliveira](https://github.com/Alisson-Oliver)  
* [Jaderson Teles](https://github.com/JeerTeles)
* [Rafael Guerra](https://github.com/rafaelguerrah)
  
## 📄 License

This project is under the license (compass Uol - Xcode group)

