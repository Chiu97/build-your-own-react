import { RequestIdleCallbackDeadline } from './@types/requestIdleCallbackPolyfill'
import DEFS from './CONSTANTS'
import { createDOM, updateDom } from './dom'
import { getFibreParentDom, isFunctionComponent } from './utils'
let wipRoot: FibreNode|null = null
let wipFibre: FibreNode
let currentRoot: FibreNode|null = null
let deletions: FibreNode[] = []
let hookIndex = 0

function setWipRootAndStartWorking (root: FibreNode) {
    wipRoot = root
    wipRoot.alternate = currentRoot 
    nextWorkUnit = wipRoot
}

function useState<T>(initialVal: T): [T, SetState<T>] {
    const oldHook: ReactiveHook = wipFibre?.alternate?.hooks[hookIndex] || {state: initialVal, actions: []}
    const actions = oldHook.actions
    let hook: ReactiveHook = {
        state: oldHook.state,
        actions: []
    }

    actions.forEach(action => {
        if (typeof action === 'function') {
            hook.state = action(hook.state)
        } else {
            hook.state = action
        }
    })

    const setState = (action: DispatchState<T>) => {
        hook.actions.push(action)
        setWipRootAndStartWorking({
            dom: currentRoot.dom,
            alternate: currentRoot,
            props: currentRoot.props,
            parent: null
        })
    }

    wipFibre.hooks.push(hook)
    hookIndex++
    return [hook.state, setState]
}

const commitWork = (fibre: FibreNode|null) => {
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
            commitDeletion(fibre, parentDom)
            break
        default:
            break
    }
    commitWork(fibre.child)
    commitWork(fibre.sibling)
}

const commitDeletion = (fibre: FibreNode, parentDom: HTMLElement|Text) => {
    if (!fibre||!parentDom) return
    if (fibre.dom) {
        parentDom.removeChild(fibre.dom)
    } else {
        commitDeletion(fibre.child, parentDom)
    }
}

const commitRootWork = (): void => {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
    deletions = []
}


/**
 * depth first traversal
 * 1. create dom for current fibre (function component doesn't has dom node)
 * 2. create children fibre (reconcileChildren did it)
 * 3. return next work fibre
 */
const performUnitOfWork = (currentFibre: FibreNode): FibreNode => {
    if (isFunctionComponent) {
        wipFibre = currentFibre
        hookIndex = 0
        currentFibre.hooks = []
    }

    if (!currentFibre.dom&&!isFunctionComponent(currentFibre)) {
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
const reconcileChildren = (wipFibre: FibreNode) => {
    const r_elements: ReactiveElement[] = typeof wipFibre.type === 'function' ? [wipFibre.type(wipFibre.props)] : wipFibre.props.children
    let oldFibre: FibreNode|null = wipFibre?.alternate?.child || null
    let idx = 0
    let prevSibling: FibreNode
    while (idx<r_elements.length||oldFibre) {
        const element =r_elements[idx]

        let newFibre: FibreNode|null = null

        const sameType = oldFibre && element && element.type === oldFibre.type
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

let nextWorkUnit: FibreNode|null = null
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

export { setWipRootAndStartWorking, useState }