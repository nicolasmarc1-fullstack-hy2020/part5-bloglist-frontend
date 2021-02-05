import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import BlogList from './BlogList'

const blogs = [
  {
    title: 'Microservices and the First Law of Distributed Objects',
    author: 'Martin Fowler',
    url:
      'https://martinfowler.com/articles/distributed-objects-microservices.html',
    likes: 4,
    user: {
      name: 'Arto Hellas',
      username: 'hellas',
      id: '5e9af2423c8380a82c803862',
    },
    id: '5ea0f9c4d6b87a3b84954a86',
  },
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
  },
  {
    title: 'Things I Don’t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 7,
    user: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      id: '5e9af13e3c8380a82c803860',
    },
    id: '5e9af3013c8380a82c803863',
  },
  {
    title: 'n,;n,;',
    author: 'ghg',
    url: 'cbvcb',
    likes: 6,
    user: {
      name: 'test',
      username: 'test',
      id: '5ea0c5ea087eb81570239b08',
    },
    id: '5ea0fdf4d6b87a3b84954a89',
  },
]

describe('BlogList', () => {
  const testedBlog = 1
  let component
  let blogsArray
  let blogToTest
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
      <BlogList
        blogs={blogs}
        deleteOwnBlog={deleteOwnBlog}
        addOneLike={addOneLike}
        isBlogAdder={isBlogAdder}
      />
    )

    blogsArray = component.container.querySelectorAll('.blog')
    blogToTest = blogsArray[testedBlog]

    blogTitle = blogToTest.querySelector('.blogTitle')
    blogAuthor = blogToTest.querySelector('.blogAuthor')
    blogURL = blogToTest.querySelector('.blogURL')
    blogLikes = blogToTest.querySelector('.blogLikes')
    blogDetails = blogToTest.querySelector('.blogDetails')
  })

  test('should initially render blog title, author but not url, likes ', () => {
    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogURL).not.toBeVisible()
    expect(blogLikes).not.toBeVisible()

    // or try with specific content and check display none to check if visible or not
    expect(blogTitle).toHaveTextContent(blogs[testedBlog].title)
    expect(blogAuthor).toHaveTextContent(blogs[testedBlog].author)
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('after clicking on view button, should also show likes and url', () => {
    const viewButton = component.getAllByText('view')[testedBlog]
    fireEvent.click(viewButton)

    expect(blogTitle).toBeVisible()
    expect(blogAuthor).toBeVisible()
    expect(blogURL).toBeVisible()
    expect(blogLikes).toBeVisible()
    expect(blogTitle).toHaveTextContent(blogs[testedBlog].title)
    expect(blogAuthor).toHaveTextContent(blogs[testedBlog].author)
    expect(blogURL).toHaveTextContent(blogs[testedBlog].url)
    expect(blogLikes).toHaveTextContent(blogs[testedBlog].likes)
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {
    const likeButton = component.getAllByText('like')[testedBlog]
    fireEvent.click(likeButton)
    expect(addOneLike.mock.calls).toHaveLength(1)
    fireEvent.click(likeButton)
    expect(addOneLike.mock.calls).toHaveLength(2)
  })

  // test('blogs to be sorted by most likes and equal liked blog alphabetically', () => {
  //   const expectedSortedTitles = [
  //     'Things I Don’t Know as of 2018',
  //     'n,;n,;',
  //     'FP vs. OO',
  //     'Microservices and the First Law of Distributed Objects',
  //   ]
  //   const titles = [...component.container.querySelectorAll('.blogTitle')]
  //   const titlesContent = titles.map(title => title.textContent)

  //   expect(titlesContent).toEqual(expectedSortedTitles)
  // })
})
