import { ProjectLayouts } from "./index";
import ProjectSuspense from "../ProjectSuspense";

const ProjectLayout = (props: any) => {
  const Layout = ProjectLayouts["layout1"];

  return (
    <ProjectSuspense>
      <Layout {...props} />
    </ProjectSuspense>
  );
};

export default ProjectLayout;
