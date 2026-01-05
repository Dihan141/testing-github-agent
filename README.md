# Todo App with Authentication

A full-stack todo application built with React, Node.js, Express, Prisma, and PostgreSQL, featuring user authentication.

## Features

- **User Authentication**: Register and login with email/password
- **Secure**: JWT-based authentication with password hashing
- **CRUD Operations**: Create, read, update, and delete todos
- **User-specific**: Each user sees only their own todos
- **Modern UI**: Responsive design with a clean interface
- **Real-time Updates**: Immediate feedback on all actions

## Tech Stack

### Frontend
- React
- Axios for API calls
- Context API for state management
- CSS3 for styling

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd testing-github-agent
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and update DATABASE_URL with your PostgreSQL connection string
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/todoapp?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start the backend server
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables (optional, defaults to localhost:5000)
cp .env.example .env

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE todoapp;
   ```
3. Update the `DATABASE_URL` in `backend/.env`

### Option 2: Docker PostgreSQL

```bash
docker run --name postgres-todo \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=todoapp \
  -p 5432:5432 \
  -d postgres
```

Then use: `DATABASE_URL="postgresql://postgres:password@localhost:5432/todoapp?schema=public"`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos (Protected)
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Usage

1. Open `http://localhost:3000` in your browser
2. Register a new account or login if you already have one
3. Start adding todos!
4. Mark todos as complete by clicking the checkbox
5. Delete todos you no longer need

## Project Structure

```
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js         # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Authentication routes
│   │   │   └── todos.js        # Todo routes
│   │   └── index.js            # Server entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js        # Login component
│   │   │   ├── Register.js     # Register component
│   │   │   ├── TodoList.js     # Todo list component
│   │   │   └── *.css           # Component styles
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── services/
│   │   │   └── api.js          # API service
│   │   ├── App.js              # Main app component
│   │   └── index.js            # App entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
└── README.md
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (change in production!)
- `PORT`: Server port (default: 5000)

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Starts development server with hot reload
```

## Security Notes

- Change the `JWT_SECRET` in production
- Use environment variables for sensitive data
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- All todo routes are protected by authentication middleware

## License

ISC
