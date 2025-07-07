import { lazy } from "react";
import { Navigate, Route } from "react-router";
import ProtectedRoutes from "../components/common/ProtectedRoutes";
import Dishes from "../pages/dietitian/Dishes";
import Menus from "../pages/dietitian/Menus";
import Ingredients from "../pages/dietitian/Ingredients";
import Patients from "../pages/dietitian/Patient";
import PatientAppointments from "../components/dietitian/AppointmentsList";
import DishesLayout from "../components/dietitian/DishesLayout";

const Dashboard = lazy(() => import("../components/dietitian/Dashboard"));
const PlannedAppointments = lazy(
  () => import("@/pages/dietitian/PlannedAppointments"),
);
const GenerateMenu = lazy(() => import("../components/dietitian/GenerateMenu"));
const DishForm = lazy(() => import("../components/dietitian/DishForm"));
const IngredientForm = lazy(
  () => import("../components/dietitian/IngredientForm"),
);
const AddAppointment = lazy(() => import("../pages/dietitian/AddAppointment"));
const EditAppointment = lazy(
  () => import("../pages/dietitian/EditAppointment"),
);
const MealForm = lazy(() => import("../components/dietitian/MealForm"));
const MenusForm = lazy(() => import("../components/dietitian/MenusForm"));
const PatientMenu = lazy(() => import("../pages/dietitian/PatientMenu"));
const AccountSettings = lazy(
  () => import("../components/common/AccountSettings"),
);

export const DietitianRoutes = (
  <Route element={<ProtectedRoutes allowedRole="dietitian" />}>
    <Route path="panel" element={<Dashboard />}>
      <Route index element={<Navigate replace to="zaplanowane-wizyty" />} />
      <Route path="zaplanowane-wizyty" element={<PlannedAppointments />} />
      <Route path="baza" element={<DishesLayout />}>
        <Route index element={<Navigate replace to="posiłki" />} />
        <Route path="posiłki" element={<Dishes />}>
          <Route path="nowy" element={<DishForm />} />
          <Route path=":dishId" element={<DishForm />} />
        </Route>
        <Route path="składniki" element={<Ingredients />}>
          <Route path="nowy" element={<IngredientForm />} />
          <Route path=":ingredientId" element={<IngredientForm />} />
        </Route>
      </Route>
      <Route path="baza-jadłospisów" element={<Menus />}>
        <Route path="nowy" element={<MenusForm />} />
        <Route path=":menuId" element={<MenusForm />} />
      </Route>

      <Route path=":patientId" element={<Patients />}>
        <Route index element={<Navigate replace to="wizyty" />} />
        <Route path="wizyty" element={<PatientAppointments />}>
          <Route path="nowa-wizyta" element={<AddAppointment />} />
          <Route path=":appointmentId" element={<EditAppointment />} />
        </Route>
        <Route path="jadłospis" element={<PatientMenu />}>
          <Route path="nowy-posiłek" element={<MealForm />} />
          <Route path=":mealId" element={<MealForm />} />
          <Route path="generuj-nowy" element={<GenerateMenu />} />
        </Route>
      </Route>
      <Route path="ustawienia" element={<AccountSettings />} />
    </Route>
  </Route>
);
