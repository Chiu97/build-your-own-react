interface ReactiveElement {
    $$type: Symbol|string,
    type: string|ReactiveElementFunction,
    props: ReactiveProps
}

interface ReactiveProps {
    children?: ReactiveElement[]|null;
    key?: string,
    nodeValue?: any,
    [key: string]: any
}

type ReactiveElementFunction = (props: any) => ReactiveElement

type ReactiveHook = {
    state: any;
    actions: Function[]|any[];
}

type DispatchState<T> = (newState: T) => T
type SetState<T> = (action: DispatchState<T>|T) => void

interface FibreNode {
    $$type?: Symbol|string;
    dom?: HTMLElement|Text;
    type?: string|ReactiveElementFunction;
    key?: string;
    child?: FibreNode;
    sibling?: FibreNode;
    parent: FibreNode|null;
    props: ReactiveProps;
    alternate?: FibreNode|null;
    effectTag?: string;
    hooks?: ReactiveHook[];
}
