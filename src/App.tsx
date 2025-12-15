import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";

import { Transactions } from "./pages/transactions";
import Dashboard from "./pages/dashboard";
import Welcome from "./pages/welcome";

import { Private } from "../src/routes/private";

const router = createBrowserRouter([
  {
    element: (
      <Private>
        <Layout />
      </Private>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/transactions", element: <Transactions /> },
    ],
  },
  {
    path: "/",
    element: <Welcome />,
  },
]);

export { router };
