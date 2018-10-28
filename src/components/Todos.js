import React, { useState, useEffect } from "react"
import Todo from './Todo'
const uid = () => btoa(Date.now() * Math.random()).substring(0, 8)

const useField = (init = "", nativeOpts = {}) => {
    const [str, setStr] = useState(init)
    return {
        bind: {
            value: str,
            onChange: e => setStr(e.target.value),
            ...nativeOpts
        },
        clear: () => setStr(""),
        init: () => setStr("init"),
        value: str,
        set: setStr
    }
}

export default function (props) {
    const [todos, setTodos] = useState([]);
    const title = useField("", { placeholder: 'Title' })
    const description = useField("")

    const [displayDoneTodos, toggleDisplayDoneTodos] = useState(false)

    const addTodo = (title, description) =>
        setTodos([...todos, {
            title,
            description,
            id: uid(),
            done: false
        }])

    const removeTodo = (id) => setTodos(todos.filter(t => t.id !== id))
    const doneTodos = todos.filter(t => t.done)
    const undoneTodos = todos.filter(t => !t.done)
    useEffect(() => {
        document.title = `You have ${undoneTodos.length} things to do!`
    })
    const handleSubmit = (event) => {
        event.preventDefault()
        addTodo(title.value, description.value)
        title.clear()
        description.clear()
    }

    const toggleTodoDone = (id) => setTodos(todos.map(t => {
        if (t.id !== id) {
            return t
        }
        return {
            ...t, done: !t.done
        }
    }))
    return (
        <div>
            Todos:
            {undoneTodos.map(t => <Todo {...t} onToggle={() => toggleTodoDone(t.id)} />)}
            <div>
                <button className="Todos__display-done-todos" onClick={() => toggleDisplayDoneTodos(!displayDoneTodos)}>
                    Show/hide done todos
                </button>
                {displayDoneTodos &&
                <div className="Todos__done-todos">
                    {doneTodos.map(t => <Todo {...t} onToggle={() => toggleTodoDone(t.id)} />)}
                </div>
                }
            </div>
            <h3>Add todo:</h3>
            <form onSubmit={handleSubmit}>
                <input {...title.bind} type="text"/>
                <textarea {...description.bind}>
                </textarea>
                <input type="submit" value="Add todo"/>
            </form>
        </div>
    )
}