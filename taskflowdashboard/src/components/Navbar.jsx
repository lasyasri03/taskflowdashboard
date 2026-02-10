import '../styles/Navbar.css'

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h3>📋 TaskFlow</h3>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-user">
            <span className="user-name">Hello, {user?.name}!</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
