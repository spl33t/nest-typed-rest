"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertParamsIntoPath = void 0;
const insertParamsIntoPath = ({ path, params, }) => {
    return path
        .replace(/:([^/]+)/g, (_, p) => {
        return params[p] || '';
    })
        .replace(/\/\//g, '/');
};
exports.insertParamsIntoPath = insertParamsIntoPath;
//# sourceMappingURL=paths.js.map