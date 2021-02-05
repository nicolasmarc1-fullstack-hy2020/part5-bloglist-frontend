import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

const LoginForm = ({ userLogin, children}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSumbit = (event) => {
    event.preventDefault()
    userLogin({
      username,
      password,
    })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>login to the application</h2>
      {children}
      <form onSubmit={handleSumbit}>
        <div>
          username
          <input
            type="text"
            name="username"
            data-testid="username-input"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="password"
            data-testid="password-input"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" data-testid="login-button">Sign-in</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  children: PropTypes.node,
  userLogin: PropTypes.func.isRequired,
}

LoginForm.defaultProps = {
  children: ""
}

export default LoginForm
