import React, { useState } from 'react'

const BlogCore = ({
  blog,
  addOneLike,
  isBlogAdder,
  deleteOwnBlog,
  toggleBlogListFocus,
  isFocused,
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const detailsStyle = { display: isFocused ? '' : 'none' }
  const toggleLabel = isFocused ? 'hide' : 'view'

  const toggleDetails = () =>
    isFocused ? toggleBlogListFocus(null) : toggleBlogListFocus(blog)

  return (
    <div className="blog" style={blogStyle}>
      <span className="blogTitle">{blog.title} </span>
      <span className="blogAuthor">{blog.author} </span>
      <button onClick={() => toggleDetails()}>{toggleLabel}</button>
      <div className="blogDetails" style={detailsStyle}>
        <div className="blogURL">{blog.url}</div>
        <div className="blogLikes">
          {blog.likes}
          <button onClick={(event) => addOneLike(event, blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {isBlogAdder(blog) && (
          <div>
            <button data-testid="delete button" onClick={(event) => deleteOwnBlog(event, blog)}>
              remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


//  if doesn't want a Blog in a list or if doesn't want to collapse other Blogs when click on a new one + testing
const BlogFallbackToggle = ({
  blog,
  addOneLike,
  isBlogAdder,
  deleteOwnBlog,
}) => {
  const [focusedBlog, setFocusedBlog] = useState(null)
  const isFocused = (blogCore) => focusedBlog ? blogCore.id === focusedBlog.id : false

  return (
    <BlogCore
      key={blog.id}
      blog={blog}
      deleteOwnBlog={deleteOwnBlog}
      addOneLike={addOneLike}
      isBlogAdder={isBlogAdder}
      toggleBlogListFocus={(blogToFocus) => setFocusedBlog(blogToFocus)}
      isFocused={isFocused(blog)}
    />
  )
}

export default function Blog(props) {
  if(props.toggleBlogListFocus === undefined || props.isFocused === undefined){
    if(props.blog === undefined){
      return ''
    }
    return BlogFallbackToggle(props)
  }

  return BlogCore(props)
}
