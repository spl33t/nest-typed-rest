import { routes } from "@/shared/routing";
import { createRoutesView} from "atomic-router-react";
import { HomePage } from "./home";
import { AuthPage } from "@/pages/auth";
import { WithHeaderLayout } from "@/widgets/layouts/with-header";
import { NotFoundPage } from "@/pages/errors/not-found";
import { UserPage } from "@/pages/user/view";
import { NotAccessPage } from "@/pages/errors/not-access/view";

export const RoutesView = createRoutesView({
  routes: [
    { route: routes.home.route, view: HomePage, layout: WithHeaderLayout },
    { route: routes.user.route, view: UserPage, layout: WithHeaderLayout },
    { route: routes.auth.route, view: AuthPage, layout: WithHeaderLayout },
    { route: routes.notAccess.route, view: NotAccessPage, layout: WithHeaderLayout },
  ],
  otherwise() {
    return <WithHeaderLayout><NotFoundPage/></WithHeaderLayout>;
  },
})