import React from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'info' || type === 'error') {
    return (
      <div className={type}>
        {message}
      </div>
    )
  } else {
    return null
  }
}

export default Notification
