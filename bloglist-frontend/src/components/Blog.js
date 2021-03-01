import React, { useState } from 'react'

const Blog = ({ user, blog, likeBlog, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [buttonText, setButtonText] = useState('view')

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenDetailsVisible = {display: detailsVisible ? '' : 'none'}
  const removeBlogButtonVisibility = {display: (user === blog.user.username) ? '' : 'none'}

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
    setButtonText(buttonText === 'view' ? 'hide' : 'view')
  }

  const handleLikeButton = (event) => {
    event.preventDefault()

    const updatedBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    likeBlog(blog.id, updatedBlog)
  }

  const handleRemoveButton = (event) => {
    event.preventDefault()
    const result = window.confirm('Delete this blog?')
    if (result) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{buttonText}</button>
      </div>
      <div style={showWhenDetailsVisible}>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={handleLikeButton}>like</button>
        </div>
        <div>{blog.user.name ? blog.user.name : blog.user.username}</div>
        <div style={removeBlogButtonVisibility}>
          <button onClick={handleRemoveButton}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
