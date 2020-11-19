import { RequestIdleCallbackDeadline } from './@types/requestIdleCallbackPolyfill'
import DEFS from './CONSTANTS'
import { createDOM, updateDom } from './dom'
import { getFibreParentDom } from './utils'
let wipRoot: SimpleFibre|null = null
let currentRoot: SimpleFibre|null = null
let deletions: SimpleFibre[] = []

function render(element: ReactiveElement, container: HTMLElement|Text) {
    wipRoot = {
      dom: container,
      type: '',
      parent: null,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    }
    deletions = []
    nextWorkUnit = wipRoot
}

const commitWork = (fibre: SimpleFibre|null) => {
    if (!fibre) return
    const parentDom = getFibreParentDom(fibre)

    switch(fibre.effectTag) {
        case DEFS.EFFECT_REPLACE:
            if (fibre.dom !== null) {
                parentDom && parentDom.appendChild(fibre.dom)
            }
            break
        case DEFS.EFFECT_UPDATE:
            if (fibre.dom !== null) {
                updateDom(fibre.dom, fibre.alternate.props, fibre.props)
            }
            break
        case DEFS.EFFECT_DELETE:
            parentDom && parentDom.removeChild(fibre.dom)
            break
        default:
            break
    }

    commitWork(fibre.child)
    commitWork(fibre.sibling)
}

const commitRootWork = (): void => {
    deletions.forEach(commitRootWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}


/**
 * depth first traversal
 * 1. create dom for current fibre
 * 2. create children fibre
 * 3. return next work fibre
 */
const performUnitOfWork = (currentFibre: SimpleFibre): SimpleFibre => {
    if (!currentFibre.dom) {
        currentFibre.dom = createDOM(currentFibre)
    }

    reconcileChildren(currentFibre)

    if (currentFibre.child) {
        return currentFibre.child
    }

    let nextFibre = currentFibre
    while(nextFibre) {
        if (nextFibre.sibling) {
            return nextFibre.sibling
        }
        nextFibre = nextFibre.parent
    }

    return null
}

/**
 * 通过对新老fibre type的对比，更新effect tag，标记其所需要进行的操作
 */
const reconcileChildren = (wipFibre: SimpleFibre) => {
    const r_elements = wipFibre.props.children
    let oldFibre: SimpleFibre|null = wipFibre?.alternate?.child || null
    let idx = 0
    let prevSibling: SimpleFibre
    while (idx<r_elements.length||oldFibre) {
        const element =r_elements[idx]

        let newFibre: SimpleFibre|null = null

        const sameType = wipFibre && element && element.type === wipFibre.type
        if (sameType) {
            newFibre = {
                type: oldFibre.type,
                props: element.props,
                dom: oldFibre.dom,
                parent: wipFibre,
                alternate: oldFibre,
                effectTag: DEFS.EFFECT_UPDATE
            }
        } else {
            if (element) {
                newFibre = {
                    type: element.type,
                    props: element.props,
                    dom: null,
                    parent: wipFibre,
                    alternate: null,
                    effectTag: DEFS.EFFECT_REPLACE
                }
            } else {
                oldFibre.effectTag = DEFS.EFFECT_DELETE
                deletions.push(oldFibre)
            }
        }

        if (oldFibre) {
            oldFibre = oldFibre.sibling
        }

        if (idx === 0) {
            wipFibre.child = newFibre
        } else {
            prevSibling.sibling = newFibre
        }
        prevSibling = newFibre

        ++idx
    }
}

let nextWorkUnit: SimpleFibre|null = null
const workLoop = (deadline: RequestIdleCallbackDeadline) => {
    let enoughTime = true
    while (nextWorkUnit && enoughTime) {
        nextWorkUnit = performUnitOfWork(nextWorkUnit)
        enoughTime = deadline.timeRemaining() >= 1
    }

    if (!nextWorkUnit && wipRoot) {
        commitRootWork()
    }
    
    window.requestIdleCallback(workLoop)
}

window.requestIdleCallback(workLoop)

export { render as interruptibleRender }