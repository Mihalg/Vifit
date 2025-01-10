import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./components/AppLayout";
import Dashboard from "./components/dietician/Dashboard";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import UserPanel from "./components/user/UserPanel";
import Menu from "./pages/client/Menu";
import ShoppingList from "./pages/client/ShoppingList";
import VisitsHistory from "./pages/client/VisitsHistory";
import Account from "./pages/panel/Account";
import Clients from "./pages/panel/Clients";
import Meals from "./pages/panel/Meals";
import PlannedVisits from "./pages/panel/PlannedVisits";
import PageNotFound from "./pages/PageNotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route element={<ProtectedRoutes allowedRole="dietitian" />}>
              <Route path="panel" element={<Dashboard />}>
                <Route path="wizyty" element={<PlannedVisits />} />
                <Route path="baza-posiłków" element={<Meals />} />
                <Route path="konto" element={<Account />} />
                <Route path=":clientId" element={<Clients />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoutes allowedRole="user" />}>
              <Route element={<UserPanel />}>
                <Route path="jadłospis" element={<Menu />} />
                <Route path="wizyty" element={<VisitsHistory />} />
                <Route path="lista-zakupów" element={<ShoppingList />} />
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
