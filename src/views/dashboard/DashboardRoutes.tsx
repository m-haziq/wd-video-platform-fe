import { lazy } from "react";
import Loadable from "../../components/Loadable";
import VideoDetail from "../../components/Video/VideoDetails";

const Dashboard = Loadable(lazy(() => import("./Dashboard")));

const dashboardRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/dashboard/:id",
    element: <VideoDetail />,
  },
];

export default dashboardRoutes;
