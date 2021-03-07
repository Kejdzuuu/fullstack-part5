import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    author: 'J.R.R. Author',
    title: 'It\'s title!',
    url: 'www.url.eu',
    user: 'user'
  }

  const component = render(
    <Blog blog={blog} />
  )

  const titleAuthorDiv = component.container.querySelector('.blogTitleAndAuthor')
  expect(titleAuthorDiv).toHaveTextContent(blog.title + ' ' + blog.author)
  expect(titleAuthorDiv).not.toHaveStyle('display: none')

  const urlLikesDiv = component.container.querySelector('.blogUrlAndLikes')
  expect(urlLikesDiv).toHaveStyle('display: none')
})
