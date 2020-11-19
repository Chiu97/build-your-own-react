import { reservedPropsName } from "./reserved"

export function isReactiveElement (el: any): boolean {
    if (typeof el !== 'object') return false
    return el.$$type && el.$$type === Symbol.for('REACTIVE_ELEMENT')
}

export function isEvent (key: string): boolean {
    return key.startsWith('on')
}

interface DomUpdateOperations {
    deleteProperties?: string[];
    updateProperties?: string[]
}

/**
 * 返回此次dom更新需要做出哪些变更
 */
export function updateDomOperations (prevProps: any, nextProps: any): DomUpdateOperations {
    let operations: DomUpdateOperations = {}
    const prevKeys = Object.keys(prevProps).filter(key => !reservedPropsName.includes(key))
    const nextKeys = Object.keys(nextProps).filter(key => !reservedPropsName.includes(key))

    const updateKeys = nextKeys.filter(key => !prevKeys.includes(key) || prevProps[key]!==nextProps[key]) // key both exists in old and new props
    const deleteKeys = prevKeys.filter(key => !nextKeys.includes(key)) // key doesn't exist in new props but exists in old props

    operations.deleteProperties = deleteKeys
    operations.updateProperties = updateKeys

    return operations
}

export function isFunctionComponent (element: SimpleFibre|ReactiveElement): boolean {
    return element.type instanceof Function
}

export function getFibreParentDom (fibre: SimpleFibre): HTMLElement|null|Text {
    let parent = fibre.parent||null
    while (parent) {
        if (parent.dom) return parent.dom
    }
    return null
}