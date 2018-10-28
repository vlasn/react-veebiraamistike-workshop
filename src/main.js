import React from "react"
import { render } from "react-dom"
import Todos from "./components/_Todos"

const App = () =>
    <div>
        <Todos/>
    </div>

render(<App/>, document.getElementById("App"))
