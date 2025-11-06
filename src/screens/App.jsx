import { useEffect, useState } from 'react'
import { useUser } from '../context/useUser.jsx'
import './App.css'
import axios from 'axios'
import Row from '../components/Row.jsx'
import { useNavigate } from 'react-router-dom'

const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user, logOut } = useUser()
  const navigate = useNavigate()

  // Backend connection
  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.message : error)
      })
  }, [])

  // Add
  const addTask = () => {
    const headers = { headers: { Authorization: user.token } }
    const newTask = { description: task }

    axios.post(url + "/create", { task: newTask }, headers)
      .then(response => {
        setTasks([...tasks, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }

  // Delete
  const deleteTask = (deleted) => {
    const headers = { headers: { Authorization: user.token } }
    axios.delete(url + "/delete/" + deleted, headers)
      .then(response => {
        setTasks(tasks.filter(item => item.id !== deleted))
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }

  const handleLogout = () => {
    logOut()
    navigate('/signin')
  }

  return (
    <div id="container">
      <button onClick={handleLogout}>Logout</button>
      <h3>Todos</h3>
      <form>
        <input placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <ul>
        {
          tasks.map(item => (
            <Row item={item} key={item.id} deleteTask={deleteTask} />
          ))
        }
      </ul>
    </div>
  )
}

export default App
