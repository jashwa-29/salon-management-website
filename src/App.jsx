import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import Layout from "@/routes/layout";

import LoginPage from "./routes/Pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import Dashboard from "./routes/Pages/Dashboard.jsx";
import AdminAppointments from "./routes/Pages/AdminAppointments";
import InventoryPage from "./routes/Pages/InventoryPage";
import AdminServices from "./routes/Pages/AdminServices";
import AdminCombos from "./routes/Pages/AdminCombos";
import StaffManagement from "./routes/Pages/StaffManagement";
import AttendanceManagement from "./routes/Pages/AttendanceManagement";


function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <LoginPage />, // default root is login
        },
     
      {
  element: <ProtectedRoute />,
  children: [
    {
      path: "/dashboard",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
               { path: "appointment", element: <AdminAppointments /> },
                { path: "inventory", element: <InventoryPage /> },
                { path: "service", element: <AdminServices /> },
                        { path: "combo", element: <AdminCombos /> },
                        { path: "staff", element: <StaffManagement /> },
                           { path: "attendance", element: <AttendanceManagement /> },
                        
 
      ],
    },
  ],
}

    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
