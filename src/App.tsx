// App.tsx
import {  useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/JWTAuthContext";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);
  return (
    <>
      <AuthProvider>
        {content}
      </AuthProvider>
    </>
  );
}

export default App;
