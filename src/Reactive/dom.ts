import { isEvent, updateDomOperations } from "./utils"
import DEFS from './CONSTANTS'
import { setWipRootAndStartWorking } from "./reconciler"

/**
 * 根据props对比，更新dom
 */
const updateDom = (dom: HTMLElement|Text, prevProps: any, nextProps: any) => {
    const operations = updateDomOperations(prevProps, nextProps)

    operations.deleteProperties.forEach(key => {
        if (isEvent(key)) {
            const eventType = key.substring(2)
            dom.removeEventListener(eventType, prevProps[key])
        } else {
            // @ts-ignore
            dom[key] = ''
        }
    })

    operations.updateProperties.forEach(key => {
        if (isEvent(key)) {
            const eventType = key.substring(2)
            dom.addEventListener(eventType, nextProps[key])
        } else {
            // @ts-ignore
            dom[key] = nextProps[key]
        }
    })
}

const createDOM = (fibre: FibreNode): HTMLElement|Text => {
    const dom = fibre.type === DEFS.TEXT_ELEMENT ? document.createTextNode(fibre.props.nodeVal||'') : document.createElement(fibre.type as string)

    updateDom(dom, {}, fibre.props)

    return dom
}

function render(element: ReactiveElement, container: HTMLElement|Text) {
    const wipRoot: FibreNode = {
      dom: container,
      parent: null,
      props: {
        children: [element],
      },
      alternate: null,
    }

    setWipRootAndStartWorking(wipRoot)
}

export {
    updateDom, createDOM, render as interruptibleRender
}
