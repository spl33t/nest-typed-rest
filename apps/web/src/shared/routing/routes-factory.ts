import { chainRoute, createRoute, RouteInstance, RouteParams, RouteParamsAndQuery } from "atomic-router";
import { createEvent, sample } from "effector";
import { $$session, SessionRoles, SESSION_ROLES_ARRAY } from "../session";

type ExtractSlug<S extends string> = S extends `${string}/:${infer Slug}` ? { [Key in Slug]: string } : never

type RouteConfig<AllRoutes extends Record<any, any>> = {
  path: string,
  notAccessRoles?: { [Key in SessionRoles]?: { redirectToRoute: keyof AllRoutes } }
}

type RoutesConfig<T extends Record<any, RouteConfig<T>>> = {
  [Key in keyof T]: RouteConfig<T>
}

export type RouteInstanceCustom<T extends RouteConfig<any>> = {
  route: RouteInstance<ExtractSlug<T["path"]>>,
  access: SessionRoles[]
  path: string
}

type RoutesInstance<Routes extends Record<any, RouteConfig<any>>> = {
  [Key in keyof Routes]: RouteInstanceCustom<Routes[Key]>
}

export function routesFactory<Routes extends RoutesConfig<Routes>>(routes: Routes) {
  let result = {} as Record<keyof Routes, RouteInstanceCustom<Routes[keyof Routes]>>

  for (const routesKey in routes) {
    result[routesKey] = {
      ...routes[routesKey],
      route: createRoute(),
    } as unknown as RoutesInstance<any>[keyof Routes]
  }

  for (const routeKey in routes) {
    const routeConfig = routes[routeKey]

    if (routeConfig?.notAccessRoles) {
      const notAccessRoles = routeConfig.notAccessRoles as Record<any, { redirectToRoute: keyof Routes }> //warning!! hard coded redirectToRoute
      const rolesKeys = Object.keys(notAccessRoles) as unknown as SessionRoles

      result[routeKey].access = SESSION_ROLES_ARRAY.filter(s => !s.includes(rolesKeys))

      for (const roleKey in notAccessRoles) {
        const role = notAccessRoles[roleKey]
        const redirectRoute = result[role.redirectToRoute].route

        chainRouteAccessByRole({
          route: result[routeKey].route,
          notAccessRoles: rolesKeys,
          redirectRoute: redirectRoute
        })
      }
    } else {
      result[routeKey].access = SESSION_ROLES_ARRAY
    }
  }

  return result
}


export function chainRouteAccessByRole<Params extends RouteParams>(
  { notAccessRoles, redirectRoute, route }:
    {
      route: RouteInstance<Params>,
      notAccessRoles: SessionRoles,
      redirectRoute: RouteInstance<any>
    }
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();

  const notAccess = sample({
    clock: [$$session.$role, sessionCheckStarted],
    source: $$session.$role,
    filter: (currentRole) => currentRole.includes(notAccessRoles),
  });

  const alreadyAccess = sample({
    clock: [$$session.$role, sessionCheckStarted],
    source: $$session.$role,
    filter: (currentRole) => !currentRole.includes(notAccessRoles),
  });

  sample({
    clock: notAccess,
    target: redirectRoute.open,
  });

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAccess],
    cancelOn: notAccess,
  });
}