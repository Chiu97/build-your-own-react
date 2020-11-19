/** @jsx Reactive.createElement */
import * as Reactive from './Reactive'

const FirstCmp = () => {
    return (
        <div className="missy" jackey="love">
            <span dataPage="golang" style={{height: '20px'}}>Go Land</span>
            <span>PyCharm</span>
        </div>
    )
}

const el = <FirstCmp />
Reactive.interruptibleRender(el, document.getElementById('root'))

export {FirstCmp}
