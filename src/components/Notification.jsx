import PropTypes from 'prop-types'
import React from 'react'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
  }).isRequired,
}


export default Notification
