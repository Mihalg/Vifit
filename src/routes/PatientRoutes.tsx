import { Route } from "react-router";
import { lazy } from "react";
import ProtectedRoutes from "../components/common/ProtectedRoutes";

const UserPanel = lazy(() => import("../components/patient/UserPanel"));
const AppointmentData = lazy(
  () => import("../components/patient/AppointmentData"),
);
const Menu = lazy(() => import("../pages/patient/Menu"));
const VisitsHistory = lazy(() => import("../pages/patient/VisitsHistory"));
const ShoppingList = lazy(() => import("../pages/patient/ShoppingList"));
const AccountSettings = lazy(
  () => import("../components/common/AccountSettings"),
);

export const PatientRoutes = (
  <Route element={<ProtectedRoutes allowedRole="patient" />}>
    <Route element={<UserPanel />}>
      <Route path="jadłospis" element={<Menu />} />
      <Route path="wizyty" element={<VisitsHistory />}>
        <Route path=":appointmentId" element={<AppointmentData />} />
      </Route>
      <Route path="lista-zakupów" element={<ShoppingList />} />
      <Route path="ustawienia" element={<AccountSettings />} />
    </Route>
  </Route>
);
