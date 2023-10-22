import React, { Suspense } from "react";
const LoadingFallbackComponent: React.FC = () => {
  return <div>Loading...</div>;
};
interface ProjectSuspenseProps {
  children: any;
}
const ProjectSuspense: React.FC<ProjectSuspenseProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingFallbackComponent />}>{children}</Suspense>
  );
};
export default ProjectSuspense;