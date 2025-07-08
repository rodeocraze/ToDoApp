import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import AddTaskPage from './pages/AddTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import EditTaskPage from './pages/EditTaskPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-task" 
                element={
                  <ProtectedRoute>
                    <AddTaskPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/task/:taskId" 
                element={
                  <ProtectedRoute>
                    <TaskDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/task/:taskId/edit" 
                element={
                  <ProtectedRoute>
                    <EditTaskPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
