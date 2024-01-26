import { createQuery } from "@farfetched/core";
import { createEffect, createStore, sample } from "effector";
import { LOCAL_STORAGE_KEYS } from "../config/local-storage";
import { api } from "../api";
import { UserContract } from "@packages/contracts";
import { appStarted } from "@/shared/config/app";

const GUEST_KEY = "GUEST" as const

export const SESSION_ROLES_ARRAY = [...Object.values(UserContract.UserRoleEnum), GUEST_KEY]
export type SessionRoles = keyof typeof UserContract.UserRoleEnum | typeof GUEST_KEY

function getAccessToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
}

function getSessionRole() {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ROLE) as UserContract.UserRoleEnum | undefined
}

const signUpQuery = createQuery({ handler: api.auth["@post/register"] })
const signInQuery = createQuery({ handler: api.auth["@post/login"] })
const refreshQuery = createQuery({ handler: api.auth["@post/refresh"] })
const logoutQuery = createQuery({ handler: api.auth["@post/logout"] })

const signUp = signUpQuery.start
const signIn = signInQuery.start
const logout = logoutQuery.start
const startRefresh = refreshQuery.start

const setAccessTokenFx = createEffect((token: string) => localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token))
const removeAccessTokenFx = createEffect(() => localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN))

const setSessionRoleFx = createEffect((role: UserContract.UserRoleEnum) => localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, role))
const setSessionRoleToGuestFx = createEffect(() => localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ROLE, GUEST_KEY))

const $user = createStore<UserContract.User | null>(null)
  .on([
    signInQuery.finished.success,
    signUpQuery.finished.success,
    refreshQuery.finished.success
  ], (_, payload) => payload.result.user)
  .reset([removeAccessTokenFx.done])

const $isAuth = createStore(Boolean(getAccessToken()))
  .on([setAccessTokenFx.done], () => true)
  .on([removeAccessTokenFx.done], () => false)

const $role = createStore<SessionRoles>(getSessionRole() || GUEST_KEY)
  .on(removeAccessTokenFx.done, (_, payload) => GUEST_KEY)

sample({
  clock: [signInQuery.finished.success, refreshQuery.finished.success],
  filter: Boolean,
  fn: ({ result }) => {
    return result.user.role
  },
  target: [$role, setSessionRoleFx]
})

$role.watch(s => console.log("ROLE", s))

const $sessionIsLoading = createStore(false)
  .on([
    signInQuery.$pending,
    refreshQuery.$pending,
    logoutQuery.$pending
  ], (_, payload) => payload)

// ?????????????????????
const $sessionIsLoaded = createStore(false)
  .on([setAccessTokenFx.done], () => true)

sample({
  clock: [appStarted],
  source: { role: $role },
  fn: ({ role }) => {
    return role === "GUEST";
  },
  target: $sessionIsLoaded
})

//refresh flow
sample({
  clock: appStarted,
  source: $isAuth,
  filter: (isAuth) => {
    return Boolean(isAuth);
  },
  target: startRefresh
})

//signIn flow
sample({
  clock: [signInQuery.finished.success, refreshQuery.finished.success],
  filter: Boolean,
  fn: ({ result }) => {
    return result.ACCESS_TOKEN
  },
  target: setAccessTokenFx
})

//logout flow
sample({
  clock: [logoutQuery.finished.success, logoutQuery.finished.failure, refreshQuery.finished.failure],
  target: [removeAccessTokenFx, setSessionRoleToGuestFx,]
})

export const $$session = {
  $user,
  $role,
  $sessionIsLoading,
  $sessionIsLoaded,
  logout,
  signIn,
  signUp,
  startRefresh,
  '@@unitShape': () => ({
    user: $user,
    role: $role,
    sessionIsLoading: $sessionIsLoading,
    sessionIsLoaded: $sessionIsLoaded,
  }),
}