import { useSystemTheme } from "@/hooks/useSystemTheme";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type DarkModeContext = {
  isDarkModeOn: boolean;
  setIsDarkModeOn: Dispatch<SetStateAction<boolean>>;
};

const DarkModeContext = createContext<DarkModeContext | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemTheme();
  const [isDarkModeOn, setIsDarkModeOn] = useState(systemTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (isDarkModeOn) {
      root.classList.add("dark");
      return;
    }

    root.classList.add("light");
  }, [isDarkModeOn]);

  return (
    <DarkModeContext.Provider value={{ isDarkModeOn, setIsDarkModeOn }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const UseDarkModeContext = () => {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error(
      "UseDarkModeContext has to be used within <UseDarkModeContext.Provider>",
    );
  }

  return context;
};
