import { lazy } from 'react';

const JwtLogin = (lazy(() => import('./LoginPage')));

const sessionRoutes = [
  { path: '/signin', element: <JwtLogin /> },
];

export default sessionRoutes;