import { createEvent, createStore, sample } from "effector";
import { routes } from "@/shared/routing";
import { createQuery } from "@farfetched/core";

const $$currentRoute = routes.home.route

export const increment = createEvent()
export const $count = createStore(0)

sample({
  clock: increment,
  source: $count,
  fn: (count) => ++count,
  target: $count
})

sample({
  clock: [$$currentRoute.opened],
  fn: () => {
    console.log("home opened")
  }
})


