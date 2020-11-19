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

type ReactiveElementFunction = (props: any) => ReactiveElement

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
}
