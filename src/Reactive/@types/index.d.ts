interface ReactiveElement {
    $$type: Symbol|string,
    type: string|ReactiveElementFunction,
    props: ReactiveProps
}

interface ReactiveProps {
    children?: ReactiveElement[]|null;
    key?: string,
    [key: string]: any
}

interface FibreNode {
    type: string;
    $$type?: Symbol|string,
    key?: string;
    children: FibreNode[],
    sibling: FibreNode[],
    alternate: FibreNode, // the alternate fibre node correponse with the same node
    return?: FibreNode|null // virtual stack frame, usually back to it's parent
}

type ReactiveElementFunction = (props: any) => ReactiveElement

interface SimpleFibre {
    $$type?: Symbol|string;
    dom?: HTMLElement|Text;
    type?: string|ReactiveElementFunction;
    key?: string;
    child?: SimpleFibre;
    sibling?: SimpleFibre;
    parent: SimpleFibre|null;
    props: ReactiveProps;
    alternate?: SimpleFibre|null;
    effectTag?: string;
}
