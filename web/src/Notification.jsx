import React from 'react'

export const NotificationType = {
    SUCCESS: 'success',
    ERROR: 'error',
}

const Notification = ({ message, type }) => {

    const color = type === NotificationType.ERROR ? 'red' : 'green';

    const notificationStyle = {
        color: color,
        background: 'lightgrey',
        border: `3px solid ${color}`,
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    if (!message) {
        return null
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification