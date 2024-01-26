import { RequestMethod, Controller } from "@nestjs/common";
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { ParamsFromUrl, insertParamsIntoPath } from "./paths";
import path from "path";


type AnyFunction = (...args: any[]) => any

export type ExcludeKeysWithTypeOf<T, V> = {
    [K in keyof T]-?: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];

export type ExcludeByType<T, V> = Pick<T, ExcludeKeysWithTypeOf<T, V>>;

type EmptyObject = {
    [K in any]: never
}

//@ts-ignore
type PartialBy<T, K extends PropertyKey> = Omit<T, K> & Partial<Pick<T, K>>

type UndefinedProperties<T> = {
    [P in keyof T]-?: undefined extends T[P] ? P : never
}[keyof T]

type ObjectPropsHasAllOptional<T> = Omit<T, UndefinedProperties<T>> extends EmptyObject ? true : false

type UndefinedProps<T> = keyof {
    [K in keyof T as ObjectPropsHasAllOptional<T[K]> extends true ? K : never]: K
}

export type IBodyDto<T> = {
    [Key in keyof T]: T[Key]
} & { __body: true }

export type IQueryDto<T> = {
    [Key in keyof T]: T[Key]
} & { __query: true }
//todo fix ? type for tipiya

export class BodyDto {
    __body: true
}
export class QueryDto {
    __query: true
}

type RouteNamePattern = `${string}@${HttpMethod}/${string}`

type PathFromRouteParams<T> = T extends `${string}@${string}/${infer Path}` ? Path : never
type MethodFromRouteParams<T> = T extends `${string}@${infer Method}/${string}` ? Uppercase<Method> : never
type NameFromRouteParams<T> = T extends `${infer Name}@${string}` ? Name extends "" ? "not name ;(" : Name : "not name ;("

/* type Test = NameFromRouteParams<typeof routeName4>

const routeName1 = "@get/" // method = "get", path = "/"
const routeName2 = "@get/:id"  // method = "get", path = "/:id"
const routeName3 = "freeze-user @post/:id/freeze" // with name, path = "/:id/freeze"
const routeName4 = "create-user @post/" // method = "post", path = "/"
const routeName5 = "@delete/:id" // method = "delete", path = "/:id" */

export type Client<T extends Record<any, any>> = {
    [K in keyof T]: T[K] extends Function ? ExtractRoutes<T[K]["prototype"]> : Client<T[K]>
}

type ExtractRoutes<T> = {
    [Key in keyof T as Key extends RouteNamePattern ? Key : never]: T[Key] extends AnyFunction ? RouteHandler<T[Key], Key> : never
}

type RouteHandler<
    Fn extends (...args: any) => any,
    RoutePath extends PropertyKey,
    Args = RouteParams<Fn, RoutePath>,
    Response = ReturnType<Fn> extends Promise<any> ? ReturnType<Fn> : Promise<ReturnType<Fn>>
> =
    Args extends EmptyObject ?
    () => Response :
    Omit<Args, UndefinedProps<Args>> extends EmptyObject ?
    (args?: PartialBy<Args, UndefinedProps<Args>>) => Response :
    (args: PartialBy<Args, UndefinedProps<Args>>) => Response

type RouteParams<
    FN extends (...args: any) => any,
    RoutePath extends PropertyKey,
    ARGS = Parameters<FN>
> = ExcludeByType<{
    [K in keyof ARGS as ARGS[K] extends never ? never : ARGS[K] extends IBodyDto<any> ? "body" : ARGS[K] extends IQueryDto<any> ? "query" : never]: Omit<ARGS[K], `__${string}`>
} & { pathParams: ParamsFromUrl<PathFromRouteParams<RoutePath>> }, never>

const noop = () => {
    // noop
};

export function initClient<T>(mapFetcher: (input: { path: string, body: any, queryParams: any, method: HttpMethod }) => Promise<any>) {
    function createInnerProxy<T>(path: string[] = []) {
        const proxy: unknown = new Proxy(noop, {
            get(_obj, key) {
                if (typeof key !== 'string' || key === 'then') {
                    return undefined;
                }
                return createInnerProxy([...path, key]);
            },
            async apply(_1, _2, args) {
                const routeParams = parseRouteNamePattern(path.pop() as string)
                if (routeParams) {
                    const fullpath = [...path, routeParams.routePath].join("/")

                    let body = args[0]?.body || {}
                    let query = args[0]?.query || {}
                    let pathParams = args[0]?.pathParams || {}

                    return await mapFetcher({
                        path: insertParamsIntoPath({
                            path: fullpath,
                            params: pathParams
                        }),
                        method: routeParams.httpMethod,
                        queryParams: query,
                        body
                    })
                }

            },
        });

        return proxy as T
    }
    return createInnerProxy<T>()
}


// [name][method][path]
// ! name - Название операции, если path не определен то указаное значение будет опрделено как path
// ! method - Любой 
// ? path - не обязательный параметр. Если не path не указан тогда path = name

export const httpMethods = [...Object.keys(RequestMethod), ...Object.keys(RequestMethod).map(s => s.toLowerCase())]
export type HttpMethod = keyof typeof RequestMethod | Lowercase<keyof typeof RequestMethod>

function parseRouteNamePattern(routeParams: string) {
    try {
        const routeName = routeParams.slice(0, routeParams.search("@")) || "not name ;("

        const isRoute = routeParams.search("@")
        if (isRoute === -1) throw new Error("Not route")

        const httpMethod = routeParams.slice(routeParams.search("@") + 1, routeParams.search("\\/")) as HttpMethod
        if (!httpMethods.includes(httpMethod)) throw new Error("Incorect http method")

        const routePath = "/" + routeParams.slice(routeParams.search("\\/") + 1) || "/"

        return {
            routeName,
            httpMethod,
            httpMethodNestKey: RequestMethod[httpMethod.toUpperCase() as any],
            routePath
        }
    } catch {

    }

}

export function bootstrapControllers(controllers: Record<any, any>) {
    for (const key in controllers) {
        const controller = controllers[key]

        const controllerPathByDecorator = Reflect.getMetadata(PATH_METADATA, controller) as string | string[] | undefined
        if (controllerPathByDecorator === undefined) throw new Error("Декоратор Controller не указан")
        const controllerPath = pathBuild(controllerPathByDecorator, key)
        Controller(controllerPath)(controller)

        Reflect.ownKeys(controller["prototype"])
            .filter(s => s !== "constructor")
            .forEach(route => {
                const descriptor = Reflect.getOwnPropertyDescriptor(controller["prototype"], route)
                const routeParams = parseRouteNamePattern(route as string)

                if (routeParams) {
                    let routePath: null | string[] = null
                    let routeMethod = Reflect.getMetadata(METHOD_METADATA, descriptor!.value) || routeParams.httpMethodNestKey

                    const routePathByDecorator = Reflect.getMetadata(PATH_METADATA, descriptor!.value)
                    routePath = pathBuild(routePathByDecorator, routeParams.routePath)

                    Reflect.defineMetadata(PATH_METADATA, routePath, descriptor!.value);
                    Reflect.defineMetadata(METHOD_METADATA, routeMethod, descriptor!.value);
                }
            })
    }
}

function pathBuild(pathByDecorator: string | string[], parsedPath: string) {
    let path: string[] = []

    if (Array.isArray(pathByDecorator)) {
        path = [...pathByDecorator, parsedPath]
    }
    if (typeof pathByDecorator === "string")
        path = [pathByDecorator, parsedPath]
    else
        path = [parsedPath]

    return Array.from(new Set(path));
}