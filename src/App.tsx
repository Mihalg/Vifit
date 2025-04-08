import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AccountSettings from "./components/AccountSettings";
import AppLayout from "./components/AppLayout";
import PatientAppointments from "./components/dietician/AppointmentsList";
import Dashboard from "./components/dietician/Dashboard";
import DishesLayout from "./components/dietician/DishesLayout";
import DishForm from "./components/dietician/DishForm";
import IngredientForm from "./components/dietician/IngredientForm";
import MealForm from "./components/dietician/MealForm";
import Login from "./components/Login";
import AppointmentData from "./components/patient/AppointmentData";
import UserPanel from "./components/patient/UserPanel";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AddAppointment from "./pages/dietitian/AddAppointment";
import Dishes from "./pages/dietitian/Dishes";
import EditAppointment from "./pages/dietitian/EditAppointment";
import Ingredients from "./pages/dietitian/Ingredients";
import Patients from "./pages/dietitian/Patient";
import PatientMenu from "./pages/dietitian/PatientMenu";
import PlannedAppointments from "./pages/dietitian/PlannedAppointments";
import PageNotFound from "./pages/PageNotFound";
import Menu from "./pages/patient/Menu";
import ShoppingList from "./pages/patient/ShoppingList";
import VisitsHistory from "./pages/patient/VisitsHistory";
import Menus from "./pages/dietitian/Menus";
import MenusForm from "./components/dietician/MenusForm";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoutes allowedRole="dietitian" />}>
              <Route path="panel" element={<Dashboard />}>
                <Route
                  index
                  element={<Navigate replace to="zaplanowane-wizyty" />}
                />
                <Route
                  path="zaplanowane-wizyty"
                  element={<PlannedAppointments />}
                />
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
                  <Route path=":menuId" element={<DishForm />} />
                </Route>

                <Route path=":patientId" element={<Patients />}>
                  <Route index element={<Navigate replace to="wizyty" />} />
                  <Route path="wizyty" element={<PatientAppointments />}>
                    <Route path="nowa-wizyta" element={<AddAppointment />} />
                    <Route
                      path=":appointmentId"
                      element={<EditAppointment />}
                    />
                  </Route>
                  <Route path="jadłospis" element={<PatientMenu />}>
                    <Route path="nowy-posiłek" element={<MealForm />} />
                    <Route path=":mealId" element={<MealForm />} />
                  </Route>
                </Route>
                <Route path="ustawienia" element={<AccountSettings />} />
              </Route>
            </Route>
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
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
