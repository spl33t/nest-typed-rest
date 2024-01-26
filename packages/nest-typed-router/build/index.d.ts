import { RequestMethod } from "@nestjs/common";
import { ParamsFromUrl } from "./paths";
type AnyFunction = (...args: any[]) => any;
export type ExcludeKeysWithTypeOf<T, V> = {
    [K in keyof T]-?: Exclude<T[K], undefined> extends V ? never : K;
}[keyof T];
export type ExcludeByType<T, V> = Pick<T, ExcludeKeysWithTypeOf<T, V>>;
type EmptyObject = {
    [K in any]: never;
};
type PartialBy<T, K extends PropertyKey> = Omit<T, K> & Partial<Pick<T, K>>;
type UndefinedProperties<T> = {
    [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];
type ObjectPropsHasAllOptional<T> = Omit<T, UndefinedProperties<T>> extends EmptyObject ? true : false;
type UndefinedProps<T> = keyof {
    [K in keyof T as ObjectPropsHasAllOptional<T[K]> extends true ? K : never]: K;
};
export type IBodyDto<T> = {
    [Key in keyof T]: T[Key];
} & {
    __body: true;
};
export type IQueryDto<T> = {
    [Key in keyof T]: T[Key];
} & {
    __query: true;
};
export declare class BodyDto {
    __body: true;
}
export declare class QueryDto {
    __query: true;
}
type RouteNamePattern = `${string}@${HttpMethod}/${string}`;
type PathFromRouteParams<T> = T extends `${string}@${string}/${infer Path}` ? Path : never;
export type Client<T extends Record<any, any>> = {
    [K in keyof T]: T[K] extends Function ? ExtractRoutes<T[K]["prototype"]> : Client<T[K]>;
};
type ExtractRoutes<T> = {
    [Key in keyof T as Key extends RouteNamePattern ? Key : never]: T[Key] extends AnyFunction ? RouteHandler<T[Key], Key> : never;
};
type RouteHandler<Fn extends (...args: any) => any, RoutePath extends PropertyKey, Args = RouteParams<Fn, RoutePath>, Response = ReturnType<Fn> extends Promise<any> ? ReturnType<Fn> : Promise<ReturnType<Fn>>> = Args extends EmptyObject ? () => Response : Omit<Args, UndefinedProps<Args>> extends EmptyObject ? (args?: PartialBy<Args, UndefinedProps<Args>>) => Response : (args: PartialBy<Args, UndefinedProps<Args>>) => Response;
type RouteParams<FN extends (...args: any) => any, RoutePath extends PropertyKey, ARGS = Parameters<FN>> = ExcludeByType<{
    [K in keyof ARGS as ARGS[K] extends never ? never : ARGS[K] extends IBodyDto<any> ? "body" : ARGS[K] extends IQueryDto<any> ? "query" : never]: Omit<ARGS[K], `__${string}`>;
} & {
    pathParams: ParamsFromUrl<PathFromRouteParams<RoutePath>>;
}, never>;
export declare function initClient<T>(mapFetcher: (input: {
    path: string;
    body: any;
    queryParams: any;
    method: HttpMethod;
}) => Promise<any>): T;
export declare const httpMethods: string[];
export type HttpMethod = keyof typeof RequestMethod | Lowercase<keyof typeof RequestMethod>;
export declare function bootstrapControllers(controllers: Record<any, any>): void;
export {};
//# sourceMappingURL=index.d.ts.map