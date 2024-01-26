"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapControllers = exports.httpMethods = exports.initClient = exports.QueryDto = exports.BodyDto = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const paths_1 = require("./paths");
//todo fix ? type for tipiya
class BodyDto {
    __body;
}
exports.BodyDto = BodyDto;
class QueryDto {
    __query;
}
exports.QueryDto = QueryDto;
const noop = () => {
    // noop
};
function initClient(mapFetcher) {
    function createInnerProxy(path = []) {
        const proxy = new Proxy(noop, {
            get(_obj, key) {
                if (typeof key !== 'string' || key === 'then') {
                    return undefined;
                }
                return createInnerProxy([...path, key]);
            },
            async apply(_1, _2, args) {
                const routeParams = parseRouteNamePattern(path.pop());
                if (routeParams) {
                    const fullpath = [...path, routeParams.routePath].join("/");
                    let body = args[0]?.body || {};
                    let query = args[0]?.query || {};
                    let pathParams = args[0]?.pathParams || {};
                    return await mapFetcher({
                        path: (0, paths_1.insertParamsIntoPath)({
                            path: fullpath,
                            params: pathParams
                        }),
                        method: routeParams.httpMethod,
                        queryParams: query,
                        body
                    });
                }
            },
        });
        return proxy;
    }
    return createInnerProxy();
}
exports.initClient = initClient;
// [name][method][path]
// ! name - Название операции, если path не определен то указаное значение будет опрделено как path
// ! method - Любой 
// ? path - не обязательный параметр. Если не path не указан тогда path = name
exports.httpMethods = [...Object.keys(common_1.RequestMethod), ...Object.keys(common_1.RequestMethod).map(s => s.toLowerCase())];
function parseRouteNamePattern(routeParams) {
    try {
        const routeName = routeParams.slice(0, routeParams.search("@")) || "not name ;(";
        const isRoute = routeParams.search("@");
        if (isRoute === -1)
            throw new Error("Not route");
        const httpMethod = routeParams.slice(routeParams.search("@") + 1, routeParams.search("\\/"));
        if (!exports.httpMethods.includes(httpMethod))
            throw new Error("Incorect http method");
        const routePath = "/" + routeParams.slice(routeParams.search("\\/") + 1) || "/";
        return {
            routeName,
            httpMethod,
            httpMethodNestKey: common_1.RequestMethod[httpMethod.toUpperCase()],
            routePath
        };
    }
    catch {
    }
}
function bootstrapControllers(controllers) {
    for (const key in controllers) {
        const controller = controllers[key];
        const controllerPathByDecorator = Reflect.getMetadata(constants_1.PATH_METADATA, controller);
        if (controllerPathByDecorator === undefined)
            throw new Error("Декоратор Controller не указан");
        const controllerPath = pathBuild(controllerPathByDecorator, key);
        (0, common_1.Controller)(controllerPath)(controller);
        Reflect.ownKeys(controller["prototype"])
            .filter(s => s !== "constructor")
            .forEach(route => {
            const descriptor = Reflect.getOwnPropertyDescriptor(controller["prototype"], route);
            const routeParams = parseRouteNamePattern(route);
            if (routeParams) {
                let routePath = null;
                let routeMethod = Reflect.getMetadata(constants_1.METHOD_METADATA, descriptor.value) || routeParams.httpMethodNestKey;
                const routePathByDecorator = Reflect.getMetadata(constants_1.PATH_METADATA, descriptor.value);
                routePath = pathBuild(routePathByDecorator, routeParams.routePath);
                Reflect.defineMetadata(constants_1.PATH_METADATA, routePath, descriptor.value);
                Reflect.defineMetadata(constants_1.METHOD_METADATA, routeMethod, descriptor.value);
            }
        });
    }
}
exports.bootstrapControllers = bootstrapControllers;
function pathBuild(pathByDecorator, parsedPath) {
    let path = [];
    if (Array.isArray(pathByDecorator)) {
        path = [...pathByDecorator, parsedPath];
    }
    if (typeof pathByDecorator === "string")
        path = [pathByDecorator, parsedPath];
    else
        path = [parsedPath];
    return Array.from(new Set(path));
}
//# sourceMappingURL=index.js.map