import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleLogout = (event) => {
    window.localStorage.clear()
    window.location.reload()
  }

  const addNewBlog = async (event) => {
    event.preventDefault()

    const blog = {
      title: title,
      author: author,
      url: url
    }

    try {
      const response = await blogService.create(blog)
      setBlogs(blogs.concat(response))
      showNotification(`${blog.title} by ${blog.author} added`, 'info')
    } catch (exception) {
      console.log('Something went wrong')
      showNotification('blog could not be added', 'error')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const newBlogForm = () => (
    <form onSubmit={addNewBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({target}) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({target}) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({target}) => setUrl(target.value)}
        />
      </div>
      <button type="submit">add blog</button>
    </form>
  )

  if (user === null) {
    return (
    <div>
      <h2>Log in</h2>
        {loginForm()}
        <Notification message={notificationMsg} type={notificationType} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMsg} type={notificationType} />
      <div>
        {user.hasOwnProperty('name') === true ?
          <p>logged in as {user.name}</p> :
          <p>logged in as {user.username}</p>
        }
        <button onClick={handleLogout}>logout</button>
      </div>
      <h2>create new</h2>
      <div>
        {newBlogForm()}
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App