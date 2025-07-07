import { Route } from "react-router";
import { lazy } from "react";

const PrivacyPolicy = lazy(() => import("../pages/legal/PrivacyPolicy"));
const Regulations = lazy(() => import("../pages/legal/Regulations"));

export const StaticRoutes = (
  <>
    <Route path="polityka-prywatnosci" element={<PrivacyPolicy />} />
    <Route path="regulamin" element={<Regulations />} />
  </>
);
