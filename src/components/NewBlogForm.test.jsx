import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import NewBlogForm from './NewBlogForm'

const testInput = (field, value) => {
  fireEvent.change(field, {
    target: { value },
  })
}

describe('NewBlogForm ', () => {
  test('should call event handler with right details when a new blog is called', () => {
    const addBlog = jest.fn()

    const { getByText } = render(<NewBlogForm addBlog={addBlog} />)

    const titleInput = 'title'
    const urlInput = 'url'
    const authorInput = 'author'
    const titleField = getByText('title').querySelector('input')
    const authorField = getByText('author').querySelector('input')
    const urlField = getByText('url').querySelector('input')
    testInput(titleField, titleInput)
    testInput(authorField, authorInput)
    testInput(urlField, urlInput)
    // fireEvent.change(titleField, {
    //   target: { value: titleInput },
    // })
    // fireEvent.change(authorField, {
    //   target: { value: authorInput },
    // })
    // fireEvent.change(urlField, {
    //   target: { value: urlInput },
    // })

    const submitButton = getByText('Create')
    fireEvent.click(submitButton)
    expect(addBlog.mock.calls[0][0]).toEqual({
      title: titleInput,
      author: authorInput,
      url: urlInput,
    })
  })
})
