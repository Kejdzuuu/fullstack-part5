import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

const blog = {
  author: 'J.R.R. Author',
  title: 'It\'s title!',
  url: 'www.url.eu',
  user: 'user'
}

test('NewBlogForm calls event handler with correct details', () => {
  const addNewBlog = jest.fn()

  const component = render(
    <NewBlogForm addNewBlog={addNewBlog} />
  )

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, {
    target: { value: blog.title }
  })
  fireEvent.change(author, {
    target: { value: blog.author }
  })
  fireEvent.change(url, {
    target: { value: blog.url }
  })
  fireEvent.submit(form)

  expect(addNewBlog.mock.calls).toHaveLength(1)
  expect(addNewBlog.mock.calls[0][0].title).toBe(blog.title)
  expect(addNewBlog.mock.calls[0][0].author).toBe(blog.author)
  expect(addNewBlog.mock.calls[0][0].url).toBe(blog.url)
})
