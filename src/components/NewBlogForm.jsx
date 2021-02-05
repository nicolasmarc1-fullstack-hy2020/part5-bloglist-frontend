import React, { useState } from 'react'

const NewBlogForm = ({ addBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const submitBlog = (event) => {
    event.preventDefault()
    addBlog({
      author,
      title,
      url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submitBlog}>
        <div>
          title
          <input
            required
            type="text"
            name="title"
            data-testid='title-input'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            data-testid='author-input'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            required
            type="text"
            name="url"
            data-testid='url-input'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" data-testid='submit-blog-button'>Create</button>
      </form>
    </div>
  )
}
export default NewBlogForm