# Veebiraamistikud - React.JS

## Setup
* loo kaust, `npm init -y`
* `npm install react@next react-dom@next parcel-bundler`
* Tee kohvi
* Modifitseeri `package.json` faili nii et scriptsi all oleks järgmine seis:
```json
...
"scripts": {
    ...
    "start": "parcel src/index.html",
    "build": "parcel build src/index.html"
  },
...
```
Webpacki asemel kasutame seekord minimaalset konfimist vajavat ja kiiret bundlerit nimega Parcel.
Babeli pakke, reacti loaderit jmt. ise vaja installida ei ole - parcel lahendab need dependencyd automaatselt.

* loome src kausta ja sinna sisse index.html faili. Sinna sisse lisame HTML5 boilerplatei - enamikes editorides `html:5` ja tab
* Index.htmli sisse, bodysse, loome `div`i id-ga `"App"`
* Lisaks loome javascriptifaili `main.js` ja lingime selle htmlifaili: `<script src="main.js"></script>`

main.js sisu võiks olla järgmine:
```jsx harmony
// importime reacti ning ta veebilehele toppimiseks vajaliku paki rendereri 
// (render targeteid on peale veebi veel - native, VR, etc):
import React from "react"
import { render } from "react-dom"

// Loome minimaalse viable komponendi, arrow functioni näol:
const App = () => 
    <div> Tere maailm </div>

// Kutsume renderfunktsiooni et komponent veebilehele kuvada. 
// Esimeseks argumendiks siis renderdatav, teiseks target kuhu sisse see mountida tuleks.
render(<App/>, document.getElementById("App"))
```

Jooksutame terminalis `npm run start`. Kui build on lõppenud, avame brauseri ja navigeerime `localhost:1234`.
See peaks ülal defineeritud komponendi sisu veebilehel näitama.
NB! Kui Windowsi all nt. IDEA-t kasutades faili salvestamine buildi uuesti käivita siis on settingutes ilmselt "Safe write" funktsionaalsus sisse lülitatud ja tuleks välja lülitada.

## Esimene alamkomponent
Loome src kausta sisse teise kausta nimega `components` ning sinna `Todos.js` faili.

Failis impordime reacti, täpselt nagu `main.js`-is.

Defineerime uue komponendi -  esialgu mockitud todo-de nimistuga - ja kuvame need ka välja:

```jsx harmony
import React from "react"

const Todos = function() {
    const todos = ['Üks asi', 'teine asi veel']
    return (
        <div>
            <h3>Todos:</h3>
            {todos.map(todo => <div>{todo}</div>)}
        </div>
    )
}
```

Lisaks tuleks siin loodud komponent failist exportida:
```jsx 
...
export default Todos
```

Komponendi kasutamiseks peame `main.js`-is selle importima:
```js
...
import Todos from './components/Todos'
```
ning talle `App` komponendi sees koha leidma:
```jsx harmony
const App = () => 
    <div> <Todos/> </div>
```

Uuesti brauserit vaadates peaks Todos komponent näha olema.

## State
Nüüd uurime lähemalt, miks installisime Reacti alpha-versiooni ja mitte stabiilse release.

Impordime `Todos.js` failis reactist veel `useState` ja `useEffect` funktsioonid.

`import React, {useState, useEffect} from "react"`

Mõlemad on Reacti kontekstis uus kontsept - Hookid.
Hookid lubavad meil kasutada komponendi enda state'i ja pseudo-lifecycle funktsioone, ilma et me peaks kasutama `class` tüüpi komponente.

Reacti tiim on kinnitanud et `React.Component` klass millest seni stateful komponente tehtud on ei kao ka tulevikus mitte kuhugi,
küll aga lubavad hookid meil kirjutada komponente kiiremalt ja mugavamalt. Võrdluseks tooksin välja lihtsa counter komponendi:

Class component:
```jsx harmony
import React from "react"

class Counter extends React.Component {
    constructor () {
        super()
        this.state = {
            count: 0
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick (e) {
        this.setState(prevState => {
            return {
                count: prevState.count + 1
            }
        })
    }
    render () {
        return (
            <div>
                <div>Nuppu on vajutatud {this.state.count} korda.</div>
                <button onClick={this.handleClick}> ++ </button>
            </div>
        )
    }
}

export default Counter
```

Sama komponent funktsionaalsena + useState hook:

```jsx harmony
import React, { useState } from "react"

const Counter = () => {
    const [count, setCount] = useState(0)
    return (
        <div>
            <div>Nuppu on vajutatud {count} korda.</div>
            <button onClick={setCount(count + 1)}>++</button>
        </div>
    )
}
export default Counter
```

Need on väga primitiivsed näited hookide võimalusest, hiljem loome selle ümber oma "mikroframeworki" mille abil formi submitiga tegeleme.

Praegu aga proovime saada `Todos` komponendi märkmeid salvestama. Lisame selleks mõned funktsioonid:


```jsx harmony
import React, {useState, useEffect} from "react"

//Kiire ja non-"true random" funktsioon kaheksakohalise unikaalse ID genereerimiseks
const uid = () => btoa(Date.now() * Math.random()).substr(0, 8)

const Todos = function() {
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
```

## Form
Nagu ülalpool mainitud, loome enne formi kallale tööle asumist omale helper-funktsiooni mis formide käsitlemise kordades lihtsamaks teeb:
```js
// Defineerime funktsiooni mis võtab argumentideks esialgse väärtuse (stringi kujul) ja objekti prop-idest 
// mis otse inputi külge käivad (nt placeholder). Mõlemal on default väärtused.
const useField = (initialValue = "", nativeProps = {}) => {
    const [str, setStr] = useState(initialValue)
    return {
        value: str,
        set: setStr,
        // tagastame lisaks muule ühe objekti sees onChange ja value väärtused, 
        // et seda objekti mugavam inputi külge panna oleks.
        // Lisaks veel nativeProps objektis oleva.
        : {
            onChange: e => setStr(e.target.value),
            value: str,
            ...nativeProps
        },
        // ..ja lõpuks paar utility funktsiooni:
        clear: () => setStr(""),
        init: () => setStr(initialValue)
    }
}
```

Kui nüüd komponendi sees uue fieldi registreerime, saame selle `.bind` väärtust hiljem renderis kasutada:

```jsx harmony
const Todos = function() {
    ...
    const title = useField("", { placeholder: "Title of your todo", type: 'text' })
    const description = useField()
    ...
    return (
        <div>
            ...
            <form>
                <input {...title.bind}/>
                <textarea {...description.bind}>
                </textarea>
                <input type="submit" value=""/>
            </form>
        </div>
    )
}
```

Loome formi submitile handleri..
```js
const handleSubmit = (event) => {
    event.preventDefault()
    addTodo(title.value, description.value)
    title.clear()
    description.clear()
}
```
...Ja paneme selle formile külge: 
```jsx harmony
    ...
    <form onSubmit={handleSubmit}>
    ...
```

Ainus mis veel teha on, on Todo eraldi komponenti viia. Loome faili `Todo.js`:
```jsx harmony
// Alustuseks impordime jälle Reacti
import React from "react"

// Seejärel kirjutame expordi ja defineerime prop-id, mis komponent kaasa saab
export default ({ description, title, done, onToggle }) => {
// Tagastame `div`i, klassi nimega Todo, milles on eraldi `div`id pealkirja, kirjelduse ja nupu jaoks
    return (
        <div className="Todo">
            <div className="Todo__title">{title}</div>
            <div className="Todo__description">{description}</div>
            // Nupule lisame funktsiooni, millega saab Todo'd olekut tehtud/tegemata muuta
            <button className="Todo__toggle" onClick={onToggle}>Mark {done ? 'undone' : 'done'}</button>
        </div>
    )
}
```

Selleks, et `Todo` komponenti kastuada, peame selle `Todos` komponenti importima
```js
import Todo from './Todo'
```
..Ja selle template seest returnima:
```jsx harmony
...
{todos.map(todo => <Todo {...todo} key={todo.id} onToggle={() => onToggleTodo(todo.id)}/>)}
...
```

See peaks nüüd kõik todo-d välja kuvama, aga tehtud todo-sid ära ei peida - lisame selleks enne `.map`-i filtri:
```js
// Laseme map-iq läbi ainult todod mille filterfunktsioon tagastab true, e. done !== true
{todos.filter(t => !t.done).map(...)}
```

Nüüd peaks ekraanil näha olema vaid lõpetamata todo-d. Lõpetatud todo-d kaovad visuaalselt ära - kuidas neid kuvaks_
Variant: Kasutame useState booleani peal ning loome nupu millega seda sisse-välja lülitada ning mille baasil filtreeritud, tehtud todo-de nimekirja kuvatakse.

Kui tunni lõpuni veel aega on, lisame CSSifaili ja kirjutame oma komponentidele stiilid.

Nende kasutusele võtmine on lihtne; komponendifailis `import './failinimi.css'`

Veel ideid:
* useEffect hookist document.title muutmine
