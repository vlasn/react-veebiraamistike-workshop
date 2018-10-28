import React from "react"

export default ({ description, title, done, onToggle }) => {
    return (
        <div className="Todo">
            <div className="Todo__title">{title}</div>
            <div className="Todo__description">{description}</div>
            <button className="Todo__toggle" onClick={onToggle}>Mark {done ? 'undone' : 'done'}</button>
        </div>
    )
}