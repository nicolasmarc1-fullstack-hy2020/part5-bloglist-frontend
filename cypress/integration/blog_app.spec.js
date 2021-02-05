/* eslint-disable spaced-comment */
/* eslint-disable func-names */
/// <reference types="cypress" />


describe('Blog app', function () {
  const user = {
    username: "hellas",
    name: "Arto Hellas",
    password: "pwd"
  }
  const otherUser = {
    username: "bla",
    name: "blo",
    password: "pwd"
  }
  const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
  ]

  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login to the application')
    cy.contains('Sign-in')
  })


  describe('Login', function () {

    it('succeeds with correct credentials', function () {
      cy.contains('Sign-in').click()
      cy.get('[data-testid=username-input').type(user.username)
      cy.get('[data-testid=password-input').type(user.password)
      cy.get('[data-testid=login-button').click()

      cy.contains(`${user.name} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.contains('Sign-in').click()
      cy.get('[data-testid=username-input').type(user.username)
      cy.get('[data-testid=password-input').type('blabla')
      cy.get('[data-testid=login-button').click()

      cy.get('html').should('not.contain', `${user.name} logged in`)
      cy.get('.notification.error')
        .should('contain', "wrong username or password")
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login(user)
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('[data-testid=title-input').type(blogs[0].title)
      cy.get('[data-testid=author-input').type(blogs[0].author)
      cy.get('[data-testid=url-input').type(blogs[0].url)
      cy.get('[data-testid=submit-blog-button').click()
      cy.contains(blogs[0].title)
    })

    describe('and blogs exist', function () {
      beforeEach(function () {
        blogs.map(function (blog) {
          return cy.createBlog(blog)
        })
      })

      it('A user can like a blog', function () {
        cy.contains(blogs[1].title).parent().as('theBlog')
        cy.get('@theBlog').within(() => {
          cy.contains('view').click()
          cy.get('.blogLikes').invoke('text').then((likes) => {
            return parseInt(likes, 10)
          }).then((likesBefore) => {
            cy.get('.blogLikes > button').click()
            cy.get('.blogLikes').should(($likes) => {
              const likesAfter = parseInt($likes.text(), 10)
              expect(likesAfter).to.eq(likesBefore + 1)
            })
          })
        })

      })

      it('A user can delete its own blog', function () {

        cy.contains(blogs[1].title).parent().as('theBlog')
        cy.get('@theBlog').should('contain', `${user.name}`)
        cy.get('@theBlog').within(() => {
          cy.contains('view').click()
          cy.contains('remove').click()
        })
        cy.get('html').should('not.contain', blogs[1].title)
      })

      it('Other users cannot delete the blog', function () {
        cy.request('POST', 'http://localhost:3003/api/users', otherUser)
        cy.login(otherUser)
        cy.contains(blogs[1].title).parent().as('theBlog')
        cy.get('@theBlog').should('not.contain', `${otherUser.name}`)
        cy.get('@theBlog').within(() => {
          cy.contains('view').click()
        })
        cy.get('@theBlog').should('not.contain', 'remove')
      })

      it('Blogs are ranked by most liked', function () {
        cy.get('.blogLikes').then((blogsLikes) => {
          const likesArray = []
          for (const blogLikes of blogsLikes) {
            likesArray.push(parseInt(blogLikes.innerText, 10))
          }
          const isSorted = likesArray.every((blogLikes, blogIndex, blogArray) => {
            return blogIndex === 0 || blogArray[blogIndex - 1] >= blogLikes
          })
          assert.isTrue(isSorted, 'likes are sorted by most liked')
        })
      })


    })

  })
})