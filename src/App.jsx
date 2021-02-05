import React, { useState, useEffect } from 'react'
import NewBlogForm from './components/NewBlogForm'
import Toggleable from './components/Toggleable'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const newBlogFormRef = React.createRef()

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogsToLoad) => setBlogs(blogsToLoad))
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const userLogged = JSON.parse(loggedUserJSON)
      setUser(userLogged)
      blogService.setToken(userLogged.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const userToLog = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(userToLog)
      )
      blogService.setToken(userToLog.token)
      setUser(userToLog)
    } catch (e) {
      setNotification({
        // message: e.response.data.error,
        message: 'wrong username or password',
        type: 'notification error',
      })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (blogToCreate) => {
    try {
      newBlogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogToCreate)
      setBlogs((oldBlogs) => [...oldBlogs, createdBlog])
      setNotification({
        message: `a new blog ${createdBlog.title} by ${createdBlog.author} added `,
        type: 'notification confirmation',
      })
      setTimeout(() => setNotification(null), 5000)
    } catch (e) {
      // setNotification({
      // message: e.response.data.error,
      //   type: "notification error"
      // })
      // setTimeout(()=>setNotification(null) , 5000)
    }
  }

  const addOneLike = async (event, blogToUpdate) => {
    event.preventDefault()
    try {
      const updatedBlog = await blogService.update(blogToUpdate.id, {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate.user.id,
      })
      setBlogs(
        blogs.map((blog) => (blog.id === blogToUpdate.id ? updatedBlog : blog))
      )
      // setNotification({
      //   message: `a new blog ${createdBlog.title} by ${createdBlog.author} added `,
      //   type: 'notification confirmation',
      // })
      // setTimeout(() => setNotification(null), 5000)
    } catch (e) {
      // setNotification({
      // message: e.response.data.error,
      //   type: "notification error"
      // })
      // setTimeout(()=>setNotification(null) , 5000)
    }
  }

  const deleteOwnBlog = async (event, blogToRemove) => {
    event.preventDefault()
    const confirmation = window.confirm(
      `Remove blog ${blogToRemove.title} by ${blogToRemove.author} ? `
    )
    if (confirmation) {
      try {
        blogService.delete(blogToRemove.id)
        // lastBlogFocusedRef.current = null
        setBlogs(blogs.filter((blog) => blog.id !== blogToRemove.id))
      } catch (e) {
        // setNotification({
        // message: e.response.data.error,
        //   type: "notification error"
        // })
        // setTimeout(()=>setNotification(null) , 5000)
      }
    }
  }

  const sortBlogs = (blogsList) => {
    // works but for elements with equal likes, get a different order each time
    //  return blogsList.sort((a, b) => a.likes - b.likes).reverse()
    // for elements with equal likes, order on titles to be consistent: "en" /undefined lang
    return blogsList.sort((a, b) =>
      a.likes === b.likes
        ? a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
        : b.likes - a.likes
    )
  }

  const isBlogAdder = (blog) => blog.user.username === user.username

  if (!user) {
    return (
      <div>
        <LoginForm userLogin={handleLogin}>
          {notification && <Notification notification={notification} />}
        </LoginForm>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && <Notification notification={notification} />}
      <p>
        {user.name} logged in
        <button type="submit" onClick={handleLogout}>
          log-out
        </button>
      </p>
      <Toggleable buttonLabel="create new blog" ref={newBlogFormRef}>
        <NewBlogForm addBlog={addBlog} />
      </Toggleable>
      <BlogList
        blogs={sortBlogs(blogs)}
        deleteOwnBlog={deleteOwnBlog}
        addOneLike={addOneLike}
        isBlogAdder={isBlogAdder}
      />
    </div>
  )
}

export default App
