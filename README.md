# Node Reminder API

REST API for a reminder app, built with Node.js, Express and MongoDB.
Users set reminders with a deadline, and a daily cron job sends reminder emails 30, 15, 7, 3, 2 and 1 days before the expiration date.

**Live demo:** <https://reminder-admin.davidebalice.dev>

![Screenshot](https://www.aroundweb.it/screenshot/reminder.jpg)

Related repositories:

- Admin frontend: [reminder-admin-react](https://github.com/davidebalice/reminder-admin-react)
- Mobile app: [react-native-reminder-app](https://github.com/davidebalice/react-native-reminder-app)

## Features

- JWT authentication (login, logout, signup, password reset)
- CRUD for reminders with deadline, description, category and completed status
- Reminder categories
- Daily cron job (23:00) with [node-cron](https://github.com/node-cron/node-cron) that sends email notifications before each deadline
- Dashboard counters
- User management with roles and profile photo
- Demo mode that blocks write operations

## Tech stack

- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [node-cron](https://github.com/node-cron/node-cron)
- [Nodemailer](https://nodemailer.com/) (SMTP via Brevo)
- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Multer](https://github.com/expressjs/multer) and [Sharp](https://sharp.pixelplumbing.com/)

## Getting started

### Requirements

- Node.js 20 or later
- MongoDB (local or Atlas)
- An SMTP account for sending emails

### Installation

```bash
git clone https://github.com/davidebalice/node-reminder.git
cd node-reminder
npm install
```

Sample data (users, categories and reminders) is available as MongoDB JSON exports in the `database/` folder and can be imported with `mongoimport`.

### Configuration

Create a `config.env` file in the project root:

```env
NODE_ENV=development
DATABASE=mongodb://127.0.0.1:27017/reminder
FRONTEND_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

DEMO_MODE=false
FILE_PATH=/absolute/path/to/project

EMAIL_FROM=noreply@example.com
EMAIL_RECIPIENT=you@example.com
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USERNAME=your_smtp_user
BREVO_PASSWORD=your_smtp_password
```

`EMAIL_RECIPIENT` is the address that receives the reminder emails.

### Run

| Command     | Description                                           |
| ----------- | ----------------------------------------------------- |
| `npm start` | Start the API on `http://localhost:8001` with nodemon |

## API endpoints

All routes are prefixed with `/api`. Routes marked with "auth" require a valid JWT (`Authorization: Bearer <token>`).

### Auth

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/login`                | Log in and receive a JWT        |
| GET    | `/api/logout`               | Log out                         |
| POST   | `/api/signup`               | Register a new user             |
| POST   | `/api/get/user`             | Get the logged user (auth)      |
| POST   | `/api/forgotPassword`       | Send a password reset email     |
| PATCH  | `/api/resetPassword/:token` | Reset the password with a token |
| PATCH  | `/api/updatePassword`       | Update the password             |

### Reminders and categories (auth)

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/dashboard`           | Get counters for dashboard  |
| GET    | `/api/getdemomode`         | Get the demo mode status    |
| GET    | `/api/reminders`           | List reminders              |
| GET    | `/api/reminder/:id`        | Get a reminder              |
| GET    | `/api/add/reminder/`       | Get data for a new reminder |
| POST   | `/api/add/reminder/`       | Create a reminder           |
| POST   | `/api/update/reminder/:id` | Update a reminder           |
| POST   | `/api/reminder/delete/:id` | Delete a reminder           |
| GET    | `/api/categories`          | List categories             |
| GET    | `/api/category/:id`        | Get a category              |
| POST   | `/api/add/category/`       | Create a category           |
| POST   | `/api/update/category/:id` | Update a category           |
| POST   | `/api/category/delete/:id` | Delete a category           |

### Users (auth)

| Method   | Endpoint                  | Description                    |
| -------- | ------------------------- | ------------------------------ |
| GET      | `/api/profile`            | Get the current user profile   |
| POST     | `/api/profile/update`     | Update the profile             |
| POST     | `/api/profile/password`   | Change the profile password    |
| POST     | `/api/profile/photo`      | Upload the profile photo       |
| GET      | `/api/users`              | List users                     |
| POST     | `/api/add/user`           | Create a user (admin)          |
| GET      | `/api/user/:id`           | Get a user                     |
| POST     | `/api/user/:id`           | Update a user (admin)          |
| POST     | `/api/user/delete/:id`    | Delete a user (admin)          |
| GET/POST | `/api/user/photo/:id`     | Get or upload a user photo     |
| POST     | `/api/user/password/:id`  | Change a user password (admin) |
| GET      | `/api/user/img/:filename` | Get a user image               |
| PATCH    | `/api/updateUser`         | Update user data               |
| POST     | `/api/send/email/user`    | Send an email to a user        |

## Project structure

```text
├── index.js        # Express app setup, MongoDB connection, routes and cron schedule
├── routers/        # Route definitions
├── controllers/    # Request handlers
├── models/         # Mongoose models
├── middlewares/    # Cron job, error handling, demo mode, email
└── database/       # Sample data (MongoDB JSON exports)
```

## Author

**Davide Balice** – [davidebalice.dev](https://www.davidebalice.dev)
