
import React, { createContext, useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode";
import axios from "../axios";
import { toast } from "react-toastify";

interface IUser {
  pk: string;
  email: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: IUser | null;
}

interface IAuthContextType extends AuthState {
  method: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const isValidToken = (accessToken: string | null): boolean => {
  if (!accessToken) {
    return false;
  }

  const decodedToken: { exp: number } = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

const setSession = (accessToken: string | null, email: string | null) => {
  if (accessToken && email) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("email", email);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (
  state: AuthState,
  action: { type: string; payload?: any }
): AuthState => {
  switch (action.type) {
    case "INIT":
      const { isAuthenticated, email } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user: email,
      };
    case "LOGIN":
      const { userData } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user: userData,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return { ...state };
  }
};

const AuthContext = createContext<IAuthContextType>({
  ...initialState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/account/login/", {
        email: email,
        password: password,
      });
      const { access, user: apiUser } = response.data as {
        access: string;
        user: IUser;
      };
      const { email: apiUserEmail } = apiUser;
      setSession(access, apiUserEmail);
      toast.success('Login successfully!',{type: 'success'})
      dispatch({
        type: "LOGIN",
        payload: {
          apiUserEmail,
        },
      });
    } catch (error) {
      toast.error((error as { detail?: string })?.detail || 'An error occurred', { type: 'error' });

      console.log("errrororoor", error);
    }
  };

  const logout = () => {
    setSession(null, "");
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const email = localStorage.getItem("email");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, email);
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              email,
            },
          });
        } else {
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INIT",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    })();
  }, []);

  if (!state.isInitialized) {
    return <div>...loading</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;