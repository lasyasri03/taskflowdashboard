import { useState, useEffect } from 'react'
import '../styles/Dashboard.css'

function Dashboard({ token, user }) {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      } else {
        setError('Failed to fetch tasks')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Network error while fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('Task title is required')
      return
    }

    try {
      const url = editingTask
        ? `http://localhost:5000/api/tasks/${editingTask._id}`
        : 'http://localhost:5000/api/tasks'

      const method = editingTask ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        resetForm()
        fetchTasks()
        setError('')
      } else {
        setError(data.message || 'Failed to save task')
      }
    } catch (error) {
      console.error('Error saving task:', error)
      setError('Network error while saving task')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        fetchTasks()
        setError('')
      } else {
        setError(data.message || 'Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      setError('Network error while deleting task')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: ''
    })
    setEditingTask(null)
    setShowForm(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      'in-progress': '#3498DB',
      completed: '#27AE60'
    }
    return colors[status] || '#666'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#27AE60',
      medium: '#F39C12',
      high: '#E74C3C'
    }
    return colors[priority] || '#666'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{tasks.filter(t => t.status === 'completed').length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{tasks.filter(t => t.status === 'in-progress').length}</span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="task-controls">
        <div className="task-search-filters">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="task-form">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What needs to be done?"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add task details..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="tasks-section">
        <h2>Your Tasks ({filteredTasks.length})</h2>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <div className="task-badges">
                    <span className="badge status" style={{ backgroundColor: getStatusColor(task.status) }}>
                      {task.status}
                    </span>
                    <span className="badge priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                {task.description && <p className="task-description">{task.description}</p>}

                {task.dueDate && (
                  <p className="task-due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}

                <div className="task-actions">
                  <button className="btn btn-sm btn-edit" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-delete" onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
