import { type ReactNode, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

interface PrivateProps {
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any {
  const { signed, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OrbitProgress color="#69AFF5" size="medium" text="" textColor="" />;
      </div>
    );
  }
  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
