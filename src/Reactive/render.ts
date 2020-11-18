import { isReactiveElement } from "./utils"
import constants from './CONSTANTS'
import { reservedPropsName } from './reserved'

/**
 * render reactive element to normal dom element in a recursively way
 */
const recursivelyRender = (el: ReactiveElement, container: HTMLElement): HTMLElement|Text|null => {
    if (!isReactiveElement(el)) return null

    if (el.type === constants.TEXT_ELEMENT) {
        const textNode = document.createTextNode(el.props.nodeVal)
        container.appendChild(textNode)
        return textNode
    }

    const domEl = document.createElement(el.type)

    const validPropsKeys = Object.keys(el.props).filter(key => !reservedPropsName.includes(key))
    validPropsKeys.forEach(key =>{
        // @ts-ignore
        domEl[key] = el.props[key]
    })
    if (Array.isArray(el.props.children)&&el.props.children.length>0) {
        el.props.children.forEach(child => render(child, domEl))
    }
    container.appendChild(domEl)
    return domEl
}

export {
    recursivelyRender
}