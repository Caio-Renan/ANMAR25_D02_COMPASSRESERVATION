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

## 📚 Swagger Documentation

Access the `/api` endpoint after starting the server to view the API documentation generated with Swagger.

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

## 🤝 Contribution

- Follow Gitflow: `feature/feature-name`, `fix/bug-fix`, etc.
- Use semantic commits (`feat:`, `fix:`, `docs:`)
- Pull Requests (PRs) must include a clear description of changes.
