import React, { useState } from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, deleteOwnBlog, addOneLike, isBlogAdder }) => {

  const [focusedBlog, setFocusedBlog] = useState(null)
  const isFocused = (blog) => focusedBlog ? blog.id === focusedBlog.id : false

  return (
    <div>
      {blogs
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            deleteOwnBlog={deleteOwnBlog}
            addOneLike={addOneLike}
            isBlogAdder={isBlogAdder}
            toggleBlogListFocus={(blogToFocus) => setFocusedBlog(blogToFocus)}
            isFocused={isFocused(blog)}
          />
        ))}
    </div>
  )
}
export default BlogList