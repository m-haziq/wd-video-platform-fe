import {  useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/JWTAuthContext";
import { VideoProvider } from "./contexts/VideoContext";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);
  return (
    <>
      <AuthProvider>
        <VideoProvider>{content}</VideoProvider>
      </AuthProvider>
    </>
  );
}

export default App;
