import { Suspense, ReactElement } from "react";

const LoadingFallbackComponent = (): ReactElement => {
  return <div></div>;
};

const Loadable = <P extends {}>(Component: React.ComponentType<P>) => (props: P): ReactElement => {
  return (
    <Suspense fallback={<LoadingFallbackComponent />}>
      <Component {...props} />
    </Suspense>
  );
};

export default Loadable;