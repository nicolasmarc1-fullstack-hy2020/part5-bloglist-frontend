import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const blog = 
  {
    title: 'FP vs. OO',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2018/04/13/FPvsOO.html',
    likes: 4,
    user: {
      name: 'Arto Hellas',
      username: 'hellas',
      id: '5e9af2423c8380a82c803862',
    },
    id: '5e9e0f7b3992d8059548418a',
  }
describe('Blog', () => {
  let component
  let blogTitle
  let blogAuthor
  let blogURL
  let blogLikes
  let blogDetails
  let deleteOwnBlog
  let addOneLike
  let isBlogAdder

  beforeEach(() => {
    deleteOwnBlog = jest.fn()
    addOneLike = jest.fn()
    isBlogAdder = jest.fn()

    component = render(
      <Blog
        blog={blog}
        deleteOwnBlog={deleteOwnBlog}
        addOneLike={addOneLike}
        isBlogAdder={isBlogAdder}
      />
    )
    blogTitle = component.container.querySelector('.blogTitle')
    blogAuthor = component.container.querySelector('.blogAuthor')
    blogURL = component.container.querySelector('.blogURL')
    blogLikes = component.container.querySelector('.blogLikes')
    blogDetails = component.container.querySelector('.blogDetails')
  })

  test('should initially render blog title, author but not url, likes ', () => {
    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogURL).not.toBeVisible()
    expect(blogLikes).not.toBeVisible()

    // or try with specific content and check display none to check if visible or not
    expect(blogTitle).toHaveTextContent(blog.title)
    expect(blogAuthor).toHaveTextContent(blog.author)
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('after clicking on view button, should also show likes and url', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogURL).toBeVisible()
    expect(blogLikes).toBeVisible()
    expect(blogTitle).toHaveTextContent(blog.title)
    expect(blogAuthor).toHaveTextContent(blog.author)
    expect(blogURL).toHaveTextContent(blog.url)
    expect(blogLikes).toHaveTextContent(blog.likes)
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    expect(addOneLike.mock.calls).toHaveLength(1)
    fireEvent.click(likeButton)
    expect(addOneLike.mock.calls).toHaveLength(2)
  })
})
