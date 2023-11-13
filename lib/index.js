"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HANDLE = '__default__';
exports.SPECIAL_PART = '__special__';
exports.CHILD_PART = '__child__';
exports.kId = 'id';
exports.kSpecial = 'special';
exports.kHandle = 'handle';
exports.kPriority = 'priority';
exports.PRIORITY = {
    LOW: -255,
    DEFAULT: 0,
    HIGH: 255,
};
function getInstance() {
    const root = generateNode();
    return {
        getStorage: function () {
            return root;
        },
        clearStorage: function () {
            delete root[exports.DEFAULT_HANDLE];
            root[exports.SPECIAL_PART] = [];
            root[exports.CHILD_PART] = {};
        },
        checkIsDefault: function (path, state, params) {
            return checkIsDefault(root, path, state, params);
        },
        get: function (path, state, params) {
            return get(root, path, state, params);
        },
        registerDefault: function (path, handle) {
            return registerDefault(root, path, handle);
        },
        registerSpecial: function (path, special, handle, priority = exports.PRIORITY.DEFAULT) {
            return registerSpecial(root, path, special, handle, priority);
        },
        unregister: function (path, handleId) {
            return unregister(root, path, handleId);
        },
    };
}
exports.getInstance = getInstance;
function validPath(path) {
    const paths = Array.isArray(path) ? path : [path];
    const validPath = [];
    paths.forEach(function (i) {
        if (i && i !== exports.DEFAULT_HANDLE) {
            validPath.push(String(i));
        }
    });
    return validPath;
}
exports.validPath = validPath;
function generateNode() {
    return {
        [exports.SPECIAL_PART]: [],
        [exports.CHILD_PART]: {},
    };
}
exports.generateNode = generateNode;
/**
 * Find handle in root object with path.
 * If it does not exist, get the default handle in current or above level.
 */
function get(obj, path, state, params, onlyCheckDefault = false) {
    const paths = validPath(path);
    const items = [obj];
    paths.reduce((prv, cur) => {
        if (!prv) {
            return prv;
        }
        else {
            prv[exports.CHILD_PART][cur] && items.push(prv[exports.CHILD_PART][cur]);
            return prv[exports.CHILD_PART][cur];
        }
    }, obj);
    // Special Check
    for (let i = items.length - 1; i >= 0; i--) {
        const specs = items[i][exports.SPECIAL_PART].filter(cur => cur[exports.kSpecial](state));
        if (specs.length > 0) {
            if (onlyCheckDefault) {
                return false;
            }
            else {
                const result = specs.reduce((prv, cur) => prv[exports.kPriority] < cur[exports.kPriority] ? cur : prv);
                const handle = result[exports.kHandle];
                if (params && typeof handle === 'function') {
                    return handle(params);
                }
                else {
                    return handle;
                }
            }
        }
    }
    if (onlyCheckDefault) {
        return true;
    }
    // Regular Check
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i][exports.DEFAULT_HANDLE];
        if (item) {
            if (params && typeof item === 'function') {
                const func = item;
                return func(params);
            }
            else {
                return item;
            }
        }
    }
}
function checkIsDefault(obj, path, state, params) {
    return get(obj, path, state, params, true);
}
/**
 * Register a default handle in root object.
 */
function registerDefault(obj, path, handle) {
    const paths = validPath(path);
    const item = paths.reduce((prv, cur) => {
        if (!prv[exports.CHILD_PART][cur]) {
            prv[exports.CHILD_PART][cur] = generateNode();
        }
        return prv[exports.CHILD_PART][cur];
    }, obj);
    item[exports.DEFAULT_HANDLE] = handle;
}
/**
 * Register a special handle in root object.
 */
function registerSpecial(obj, path, special, handle, priority) {
    const paths = validPath(path);
    const item = paths.reduce((prv, cur) => {
        if (!prv[exports.CHILD_PART][cur]) {
            prv[exports.CHILD_PART][cur] = generateNode();
        }
        return prv[exports.CHILD_PART][cur];
    }, obj);
    const arr = item[exports.SPECIAL_PART];
    const handleId = arr.length === 0 ? 1 : arr[arr.length - 1][exports.kId] + 1;
    arr.push({
        [exports.kId]: handleId,
        [exports.kSpecial]: special,
        [exports.kHandle]: handle,
        [exports.kPriority]: priority,
    });
    return handleId;
}
/**
 * Unregister a handle in root object.
 */
function unregister(obj, path, handleId) {
    const paths = validPath(path);
    const item = paths.reduce((prv, cur) => prv[exports.CHILD_PART][cur] || generateNode(), obj);
    if (handleId) {
        const len = item[exports.SPECIAL_PART].length;
        item[exports.SPECIAL_PART] = item[exports.SPECIAL_PART]
            .filter(cur => cur[exports.kId] !== handleId);
        return item[exports.SPECIAL_PART].length !== len;
    }
    else {
        if (item[exports.DEFAULT_HANDLE]) {
            delete item[exports.DEFAULT_HANDLE];
            return true;
        }
        else {
            return false;
        }
    }
}
//# sourceMappingURL=index.js.map