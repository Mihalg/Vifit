import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./components/common/AppLayout";

import PageNotFound from "./pages/PageNotFound";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { Suspense } from "react";
import Loader from "./components/ui/Loader";
import { DietitianRoutes } from "./routes/DietitianRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";
import { StaticRoutes } from "./routes/StaticRoutes";
import { PatientRoutes } from "./routes/PatientRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              {AuthRoutes}
              {StaticRoutes}
              <Route element={<AppLayout />}>
                {DietitianRoutes}
                {PatientRoutes}
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
