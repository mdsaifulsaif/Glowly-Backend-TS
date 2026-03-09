import { Router } from 'express';
import { UserRoutes } from '../modules/auth/user.route'; 
import { SubscriberRoutes } from '../modules/subscriber/subscriber.route';

const router = Router();

const moduleRoutes = [
  { 
    path: '/auth', 
    route: UserRoutes 
  },
  {
    path: '/subscribers', 
    route: SubscriberRoutes,
  },
];


moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;