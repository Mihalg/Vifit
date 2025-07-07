import { useAuth } from "@/hooks/useAuth";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Moon, Settings, Sun } from "lucide-react";
import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import Logo from "../ui/Logo";
import LogoutButton from "../ui/LogoutButton";
import { UseDarkModeContext } from "../common/ThemeProvider";

type MainNavContext = { toggleMenu: () => void };

type MainNavProps = PropsWithChildren & {
  isActive: boolean;
  toggleMenu: () => void;
};

type NavRowProps = {
  children: ReactNode;
  to: string;
  nestedLinks?: never;
  className?: string;
};

const MainNavContext = createContext<MainNavContext | null>(null);

const useMainNavContext = () => {
  const context = useContext(MainNavContext);

  if (!context) {
    throw new Error(
      "useMainNavContext has to be used within <MainNavContext.Provider>",
    );
  }

  return context;
};

export default function MainNav({
  children,
  isActive,
  toggleMenu,
}: MainNavProps) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const ref = useOutsideClick(handleOutsideClick);
  const { isDarkModeOn, setIsDarkModeOn } = UseDarkModeContext();

  function handleOutsideClick() {
    if (isActive) toggleMenu();
  }

  return (
    <MainNavContext.Provider value={{ toggleMenu }}>
      <nav
        ref={ref}
        className={`fixed left-0 top-0 h-dvh w-72 border-r-[1px] border-r-primary-50 py-3 text-xl backdrop-blur-md dark:border-r-secondary-400 ${isActive ? "translate-x-0" : "-translate-x-full"} flex flex-col transition-transform xl:static xl:h-full xl:w-64 xl:translate-x-0 xl:border-none`}
      >
        <Logo className="px-8" />
        <ul className="mx-auto mt-6 w-4/5 grow flex-col justify-center space-y-2">
          {children}
        </ul>
        <div className="mx-auto flex gap-10 pb-6">
          {isDarkModeOn ? (
            <Sun
              role="button"
              onClick={() => {
                setIsDarkModeOn((prev) => !prev);
              }}
            />
          ) : (
            <Moon
              role="button"
              onClick={() => {
                setIsDarkModeOn((prev) => !prev);
              }}
            />
          )}
          <Settings
            role="button"
            onClick={() => {
              void navigate(
                `/${role === "dietitian" ? "panel/" : ""}ustawienia`,
              );
            }}
          />
          <LogoutButton />
        </div>
      </nav>
    </MainNavContext.Provider>
  );
}

function NavRow({ children, to, className }: NavRowProps) {
  const { toggleMenu } = useMainNavContext();

  return (
    <li className="rounded-md">
      <NavLink
        to={to}
        className={`flex w-full items-center gap-4 rounded-md bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-800 hover:text-white ${className ? className : ""}`}
        onClick={toggleMenu}
      >
        {children}
      </NavLink>
    </li>
  );
}

MainNav.NavRow = NavRow;
