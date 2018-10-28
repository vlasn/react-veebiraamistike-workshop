// Ajutine näidis

import React, {useState, useEffect} from "react"

//Kiire ja non-"true random" funktsioon kaheksakohalise unikaalse ID genereerimiseks
const uid = () => btoa(Date.now() * Math.random()).substr(0, 8)

const Todos = function () {
    // useState aktsepteerib argumendiks esialgse state ning tagastab array [muutuja, setter].
    // Setter on vajalik kuna Reacti komponentide state on immutable - kui soovid state's midagi muuta, tuleb terve state uuesti luua.
    const [todos, setTodos] = useState([])
    // Kuna todos on primitiiv (array) ja me hetkel custom setterit kirjutama ei hakka, siis implementeerime "immutable push"-i -
    // - funktsiooni mis tagastab uue array mille elementideks on vana array elemendid + uus element
    const addTodo = (title, description) => setTodos([...todos, {title, description, id: uid(), done: false }])
    // Lisaks peaks olema võimalik märkida ID järgi todo tehtuks:
    const toggleTodoDone = (id) => setTodos(todos.map(todo => {
        // Kui todo ID ei ole sama mis muudetava todo ID, tagastame ta muutmatult:
        if (id !== todo.id) return todo
        // Vastasel juhul flipime done booleani ning destructurime ta uude objekti:
        return {...todo, done: !todo.done}
    }))

    return (
        <div>
            <h3>Todos:</h3>
            {todos.map(todo => <div key={todo.id}>{todo.title} {todo.description}</div>)}
            {/* Kuna me ei ole veel formi lisanud, loome ühe näidis-todo et kontrollida kas meie render töötab: */}
            <button onClick={() => addTodo('tere', 'maailm')}>test</button>
        </div>
    )
}

export default Todos