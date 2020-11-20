/** @jsx Reactive.createElement */
import * as Reactive from './Reactive'

const FirstCmp = () => {
    const handleClick = () => {
        console.log('click')
        setCounter((prevCount) => {
            console.log({prevCount})
            return prevCount+1
        })
    }
    const [counter, setCounter] = Reactive.useState(0)
    return (
        <div className="missy" jackey="love" onClick={handleClick}>
            <span dataPage="golang" style={{height: '20px'}}>Go Land</span>
            <span>PyCharm</span>
            <span>Counter: {counter}</span>
        </div>
    )
}

const el = <FirstCmp />
console.log(el)
Reactive.interruptibleRender(el, document.getElementById('root'))

export {FirstCmp}
