import DEFS from './CONSTANTS'

const createTextElement = (text: string): ReactiveElement => {
    return {
        $$type: DEFS.REACTIVE_ELEMENT,
        type: DEFS.TEXT_ELEMENT,
        props: {
            nodeValue: text,
            children: []
        }
    }
}

const createElement = (type: string, props: any, ...children: (ReactiveElement|string)[]): ReactiveElement => {
    return {
        $$type: DEFS.REACTIVE_ELEMENT,
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child)
            )
        }
    }
}

export {
    createElement
}