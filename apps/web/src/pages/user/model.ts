import { createQuery } from "@farfetched/core";
import { api } from "@/shared/api";
import { routes } from "@/shared/routing";
import { sample } from "effector";

const $$currentRoute = routes.user.route
export const $$getUserByIdQuery = createQuery({ handler: api.users.getOneById })

sample({
  clock: $$currentRoute.opened,
  fn: (s) => {
    return { userId: Number(s.params.id) }
  },
  target: $$getUserByIdQuery.start
})