
import { Navigate } from 'react-router-dom';
import AuthGuard from './auth/AuthGuard';
import sessionRoutes from './views/sessions/SessionRoutes';
import dashboardRoutes from './views/dashboard/DashboardRoutes';
import ProjectLayout from './components/ProjectLayout/ProjectLayout';
const routes = [
  {
    element: (
      <AuthGuard>
        <ProjectLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes],
  },
  ...sessionRoutes,
  { path: "/", element: <Navigate to="dashboard" /> },
  
];
export default routes;