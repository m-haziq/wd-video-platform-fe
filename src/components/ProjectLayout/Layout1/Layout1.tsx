import React from "react";
import { Outlet } from "react-router-dom";
import ProjectSuspense from "../../ProjectSuspense";
import Header from "../../Header/Header";

const Layout1 = () => {
  return (
    <div>
      <div>
        <div>
          <div>
            <Header />
            <ProjectSuspense>
              <Outlet />
            </ProjectSuspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout1;
