import { Route } from "react-router";
import { lazy } from "react";
import Login from "@/pages/auth/Login";

const Register = lazy(() => import("@/pages/auth/Register"));

export const AuthRoutes = (
  <>
    <Route index element={<Login />} />
    <Route path="rejestracja" element={<Register />} />
  </>
);
