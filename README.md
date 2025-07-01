# TodoApp - Full-Stack Task Management Application

A modern, full-stack todo application built with **Spring Boot** backend and **React + Vite** frontend. Features a clean, responsive design with full CRUD operations for task management.

![TodoApp Preview](https://img.shields.io/badge/Status-Active-green) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![Vite](https://img.shields.io/badge/Vite-Latest-purple)

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete tasks
- 🎯 **Priority System** - HIGH, MEDIUM, LOW priority levels with color coding
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Glass morphism effects with gradient backgrounds
- 🔄 **Real-time Updates** - Instant task updates across the application
- 📊 **Task Management** - Detailed task views with creation/update timestamps
- 🛣️ **React Router** - Multi-page navigation with clean URLs

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x with Maven
- **Database**: MySQL with JPA/Hibernate
- **API**: RESTful endpoints with CORS configuration
- **Structure**: Controller → Service → Repository pattern

### Frontend (React + Vite)
- **Framework**: React 18 with Vite build tool
- **Routing**: React Router v6
- **HTTP Client**: Axios for API communication
- **State Management**: Custom hooks with React hooks
- **Styling**: Modern CSS with responsive design

## 📁 Project Structure

```
ToDoApp/
├── backend copy/                 # Spring Boot Backend
│   ├── src/main/java/com/example/backend/
│   │   ├── Controllers/         # REST API Controllers
│   │   ├── Models/             # JPA Entity Models
│   │   ├── Repositories/       # Data Access Layer
│   │   └── Services/           # Business Logic Layer
│   └── pom.xml                 # Maven Dependencies
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   ├── pages/             # Route Components
│   │   ├── hooks/             # Custom React Hooks
│   │   └── services/          # API Service Layer
│   └── package.json           # NPM Dependencies
└── README.md
```

## 🛠️ Prerequisites

- **Java 17+** (for Spring Boot backend)
- **Node.js 18+** and **npm** (for React frontend)
- **MySQL 8.0+** (for database)
- **Maven** (for backend dependency management)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/RodeoCraze/ToDoApp.git
cd ToDoApp
```

### 2. Database Setup
1. Create a MySQL database named `todoapp`
2. Update database credentials in `backend copy/src/main/resources/application.properties`

### 3. Backend Setup
```bash
cd "backend copy"
./mvnw clean install
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/main/tasks` | Get all tasks |
| `GET` | `/main/tasks/{id}` | Get task by ID |
| `POST` | `/main/add` | Create new task |

### Task Model
```json
{
  "taskID": 1,
  "title": "Sample Task",
  "description": "Task description",
  "priority": "HIGH",
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

## 🎨 UI Pages

- **Home Page** (`/`) - Grid view of all tasks with clickable cards
- **Add Task** (`/add-task`) - Form to create new tasks
- **Task Details** (`/task/:id`) - Detailed view of individual tasks

## 🔧 Configuration

### Backend Configuration
- **Database**: Configure in `application.properties`
- **CORS**: Enabled for `http://localhost:5173`
- **Port**: Default 8080

### Frontend Configuration
- **API Proxy**: Configured in `vite.config.js`
- **Base URL**: Points to backend at `localhost:8080`
- **Port**: Default 5173

## 🚀 Deployment

### Backend Deployment
```bash
cd "backend copy"
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**RodeoCraze** - [GitHub Profile](https://github.com/RodeoCraze)

---

⭐ If you found this project helpful, please give it a star! 