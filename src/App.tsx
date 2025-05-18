import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AccountSettings from "./components/AccountSettings";
import AppLayout from "./components/AppLayout";
import PatientAppointments from "./components/dietitian/AppointmentsList";
import Dashboard from "./components/dietitian/Dashboard";
import DishesLayout from "./components/dietitian/DishesLayout";
import DishForm from "./components/dietitian/DishForm";
import IngredientForm from "./components/dietitian/IngredientForm";
import MealForm from "./components/dietitian/MealForm";
import MenusForm from "./components/dietitian/MenusForm";
import AppointmentData from "./components/patient/AppointmentData";
import UserPanel from "./components/patient/UserPanel";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AddAppointment from "./pages/dietitian/AddAppointment";
import Dishes from "./pages/dietitian/Dishes";
import EditAppointment from "./pages/dietitian/EditAppointment";
import Ingredients from "./pages/dietitian/Ingredients";
import Menus from "./pages/dietitian/Menus";
import Patients from "./pages/dietitian/Patient";
import PatientMenu from "./pages/dietitian/PatientMenu";
import PlannedAppointments from "./pages/dietitian/PlannedAppointments";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Menu from "./pages/patient/Menu";
import ShoppingList from "./pages/patient/ShoppingList";
import VisitsHistory from "./pages/patient/VisitsHistory";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import Regulations from "./pages/Regulations";
import { ThemeProvider } from "./components/ThemeProvider";
import GenerateMenu from "./components/dietitian/GenerateMenu";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route index element={<Login />} />
            <Route path="rejestracja" element={<Register />} />
            <Route path="polityka-prywatnosci" element={<PrivacyPolicy />} />
            <Route path="regulamin" element={<Regulations />} />
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
                      <Route
                        path=":ingredientId"
                        element={<IngredientForm />}
                      />
                    </Route>
                  </Route>
                  <Route path="baza-jadłospisów" element={<Menus />}>
                    <Route path="nowy" element={<MenusForm />} />
                    <Route path=":menuId" element={<MenusForm />} />
                    <Route path="generuj-nowy" element={<GenerateMenu />} />
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
                    <Route
                      path=":appointmentId"
                      element={<AppointmentData />}
                    />
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
    </ThemeProvider>
  );
}

export default App;
