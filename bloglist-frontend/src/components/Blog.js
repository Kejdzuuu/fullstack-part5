import React, { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {
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
      </div>
    </div>
  )
}

export default Blog
