export declare const DEFAULT_HANDLE = "__default__";
export declare const SPECIAL_PART = "__special__";
export declare const CHILD_PART = "__child__";
export declare const kId = "id";
export declare const kSpecial = "special";
export declare const kHandle = "handle";
export declare const kPriority = "priority";
export declare const PRIORITY: {
    LOW: number;
    DEFAULT: number;
    HIGH: number;
};
export declare type PathKey = string | number | void | null;
export declare type Path = PathKey | PathKey[];
export declare type StateFunc<S> = (state?: S) => boolean;
export declare type ResultFunc = () => any;
export declare type HandleResult<R> = R | ResultFunc | void;
export declare type HandleFunc<P, R> = (params?: P) => HandleResult<R>;
export declare type HandleId = number;
export interface Special<S, P, R> {
    id: HandleId;
    special: StateFunc<S>;
    handle: HandleFunc<P, R>;
    priority: number;
}
export interface Item<S, P, R> {
    [DEFAULT_HANDLE]?: R | HandleFunc<P, R>;
    [SPECIAL_PART]: Special<S, P, R>[];
    [CHILD_PART]: {
        [key: string]: Item<S, P, R>;
    };
}
export declare type Root<S, P, R> = Item<S, P, R>;
export interface Instance<S, P, R> {
    getStorage: () => Root<S, P, R>;
    clearStorage: () => void;
    checkIsDefault: (path: Path, state?: S, params?: P) => boolean;
    get: (path: Path, state?: S, params?: P) => HandleResult<R>;
    registerDefault: (path: Path, handle: R | HandleFunc<P, R>) => void;
    registerSpecial: (path: Path, special: StateFunc<S>, handle: HandleFunc<P, R>, priority?: number) => HandleId;
    unregister: (path: Path, handleId?: HandleId) => boolean;
}
export declare function getInstance<S, P, R>(): Instance<S, P, R>;
export declare function validPath(path: Path): string[];
export declare function generateNode<S, P, R>(): Item<S, P, R>;
//# sourceMappingURL=index.d.ts.map