import { SunIcon } from "lucide-react";
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router";
import LogoutButton from "../ui/LogoutButton";

type MainNavContext = {
  toggleMenu: () => void;
};

type MainNavProps = PropsWithChildren & {
  isActive: boolean;
  toggleMenu: () => void;
};

type NavRowWithTo = {
  children: ReactNode;
  to: string;
  nestedLinks?: never;
};

type NavRowWithLinks = {
  children: ReactNode;
  to?: never;
  nestedLinks: ReactElement;
};

type NavRowProps = NavRowWithTo | NavRowWithLinks;

type NavRowNested = {
  children: ReactNode;
  to: string;
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
  return (
    <MainNavContext.Provider value={{ toggleMenu }}>
      <nav
        className={`border-r-primary-50 absolute left-0 top-0 h-dvh w-72 border-r-[1px] py-3 backdrop-blur-md ${isActive ? "translate-x-0" : "-translate-x-full"} xl:bg-primary-100 flex flex-col transition-transform xl:static xl:h-full xl:translate-x-0 xl:border-none`}
      >
        <ul className="mx-auto mt-6 w-4/5 grow flex-col justify-center space-y-2">
          {children}
        </ul>
        <div className="mx-auto flex gap-10 pb-6">
          <button>
            <SunIcon size={28} />
          </button>
          <LogoutButton />
        </div>
      </nav>
    </MainNavContext.Provider>
  );
}

function NavRow({ children, to, nestedLinks }: NavRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleMenu } = useMainNavContext();

  function toggle() {
    setIsOpen((open) => !open);
  }

  if (!to)
    return (
      <li
        onClick={toggle}
        className="hover:bg-primary-50 w-full cursor-pointer rounded-md text-2xl transition-colors"
      >
        <span className="flex flex-col items-center px-4 py-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">{children}</div>
            <IoIosArrowDown
              className={`${isOpen ? "rotate-180" : ""} transition-transform`}
            />
          </div>
          <ul
            className={`w-full overflow-hidden ${isOpen ? "mt-2 max-h-96" : "max-h-0"} transition-all`}
          >
            {nestedLinks}
          </ul>
        </span>
      </li>
    );

  return (
    <li className="rounded-md">
      <NavLink
        to={to}
        className="hover:bg-primary-50 flex w-full items-center gap-4 rounded-md px-4 py-2 text-2xl transition-colors"
        onClick={toggleMenu}
      >
        {children}
      </NavLink>
    </li>
  );
}

function NavRowNested({ children, to }: NavRowNested) {
  const { toggleMenu } = useMainNavContext();

  return (
    <li
      onClick={(e) => {
        e.stopPropagation();
        toggleMenu();
      }}
    >
      <NavLink
        className="hover:border-primary-950 hover:bg-primary-100 ml-auto block w-11/12 rounded-r-md border-l-[1px] border-stone-400 px-2 py-1 text-base transition-colors lg:text-lg"
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}

MainNav.NavRow = NavRow;
MainNav.NavRowNested = NavRowNested;
