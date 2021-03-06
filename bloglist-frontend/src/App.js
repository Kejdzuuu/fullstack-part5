import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMsg(message)
    setTimeout(() => {
      setNotificationMsg(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    window.location.reload()
  }

  const addNewBlog = async (newBlog) => {
    newBlogFormRef.current.toggleVisibility()
    try {
      const response = await blogService.create(newBlog)
      response.user = {
        username: user.username,
        name: user.name
      }
      setBlogs(blogs.concat(response))
      showNotification(`${response.title} by ${response.author} added`, 'info')
    } catch (exception) {
      console.log('Something went wrong')
      showNotification('blog could not be added', 'error')
    }
  }

  const likeBlog = async (id, blog) => {
    try {
      const response = await blogService.update(id, blog)
      setBlogs(blogs.map(n => n.id === id ? { ...n, ...{ likes: response.likes } } : n).sort((a,b) => b.likes - a.likes))
    } catch (exception) {
      showNotification('couldn\'t like blog', 'error')
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(n => n.id !== id))
    } catch (exception) {
      showNotification('couldn\'t delete blog', 'error')
    }
  }

  const newBlogFormRef = useRef()

  const newBlogForm = () => (
    <Togglable buttonLabel='add blog' ref={newBlogFormRef}>
      <NewBlogForm addNewBlog={addNewBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
        <Notification message={notificationMsg} type={notificationType} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMsg} type={notificationType} />
      <div>
        <p>
          {user.name ?
            `logged in as ${user.name}` :
            `logged in as ${user.username}`
          }
          <button onClick={handleLogout}>logout</button>
        </p>
      </div>
      {newBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user.username} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App