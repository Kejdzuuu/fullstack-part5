const user = {
  name: 'Mr Testman',
  username: 'testman',
  password: 'password'
}

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('user can login', function() {
      cy.contains('Log in')
      cy.get('#username').type(user.username)
      cy.get('#password').type(user.password)
      cy.get('#login-button').click()

      cy.contains(`logged in as ${user.name}`)
    })

    it('login with wrong password fails', function() {
      cy.contains('Log in')
      cy.get('#username').type(user.username)
      cy.get('#password').type('wrong_password')
      cy.get('#login-button').click()

      cy.get('.error').contains('Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', `logged in as ${user.name}`)
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: user.username, password: user.password })
    })

    const blog = {
      title: 'Blog title',
      author: 'Blog author',
      url: 'www.blog.com'
    }

    it('a blog can be created', function() {
      cy.contains('add blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('#addBlogButton').click()

      cy.get('.info').contains(`${blog.title} by ${blog.author} added`)
      cy.get('.info').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains(`${blog.title} ${blog.author}`)
    })

    it('a blog can be liked', function() {
      cy.createBlog({ ...blog })

      cy.contains(`${blog.title} ${blog.author}`)
        .contains('view').click()

      cy.get(".blogUrlAndLikes").contains('0')
        .contains('like').click()
      cy.get(".blogUrlAndLikes").contains('1')
    })

    it('user that created the blog can delete it', function() {
      cy.createBlog({ ...blog })

      cy.contains(`${blog.title} ${blog.author}`)
        .contains('view').click()

      cy.get(".blogUrlAndLikes").contains('remove').click()

      cy.get('html').should('not.contain', `${blog.title} ${blog.author}`)
    })

    it('user that didn\'t create the blog can\'t delete it', function() {
      const newUser = {
        name: 'Mr Otherman',
        username: 'otherman',
        password: 'password'
      }
      cy.createBlog({ ...blog })
      cy.contains('logout').click()

      cy.request('POST', 'http://localhost:3001/api/users/', newUser)
      cy.login({ ...newUser })
      cy.contains(`${blog.title} ${blog.author}`)
        .contains('view').click()
      cy.get(".blogUrlAndLikes").contains('remove').parent().should('have.css', 'display', 'none')
    })

    it('blogs are ordered by most likes', function() {
      const secondBlog = {
        title: 'Second blog',
        author: 'Blog author',
        url: 'www.blog.com'
      }
      cy.createBlog({ ...blog })
      cy.createBlog({ ...secondBlog })

      cy.contains(`${secondBlog.title} ${secondBlog.author}`)
        .contains('view').click()

      cy.contains(`${secondBlog.title} ${secondBlog.author}`)
        .parent().contains('like').click()

      cy.reload()
      cy.get('.blogTitleAndAuthor').first()
        .contains(`${secondBlog.title} ${secondBlog.author}`)
    })
  })
})