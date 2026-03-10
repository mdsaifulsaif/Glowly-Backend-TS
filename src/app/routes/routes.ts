import { Router } from "express";
import { UserRoutes } from "../modules/auth/user.route";
import { SubscriberRoutes } from "../modules/subscriber/subscriber.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { CategoryRoutes } from "../modules/category/category.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: "/subscribers",
    route: SubscriberRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
