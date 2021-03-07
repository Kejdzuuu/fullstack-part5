import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  author: 'J.R.R. Author',
  title: 'It\'s title!',
  url: 'www.url.eu',
  user: 'user'
}

test('renders title and author only', () => {
  const component = render(
    <Blog blog={blog} />
  )

  const titleAuthorDiv = component.container.querySelector('.blogTitleAndAuthor')
  expect(titleAuthorDiv).toHaveTextContent(blog.title + ' ' + blog.author)
  expect(titleAuthorDiv).not.toHaveStyle('display: none')

  const urlLikesDiv = component.container.querySelector('.blogUrlAndLikes')
  expect(urlLikesDiv).toHaveStyle('display: none')
})

test('renders url and likes after clicking a button', () => {
  const component = render(
    <Blog blog={blog} />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const urlLikesDiv = component.container.querySelector('.blogUrlAndLikes')
  expect(urlLikesDiv).not.toHaveStyle('display: none')
})

test('when likes button is clicked twice, event handler is called twice', () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} likeBlog={mockHandler} />
  )

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
