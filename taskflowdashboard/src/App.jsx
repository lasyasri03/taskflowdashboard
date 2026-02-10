import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
      setCurrentPage('dashboard')
      // Fetch user profile
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleRegister = (token, user) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setIsAuthenticated(false)
    setUser(null)
    setCurrentPage('login')
  }

  return (
    <div className="app">
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      
      <main className={isAuthenticated ? 'authenticated-main' : 'auth-main'}>
        {!isAuthenticated ? (
          <>
            {currentPage === 'login' && (
              <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />
            )}
            {currentPage === 'register' && (
              <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />
            )}
          </>
        ) : (
          <Dashboard token={token} user={user} />
        )}
      </main>
    </div>
  )
}

export default App
