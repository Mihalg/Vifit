import { ReactNode, useState } from "react";
import Hamburger from "../navigation/Hamburger";
import MainNav from "../navigation/MainNav";

export default function SideBar({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  function toggleMenu() {
    setIsActive((state) => !state);
  }

  return (
    <div className="z-10 flex h-0 w-full flex-col items-center justify-between lg:static xl:h-dvh xl:w-fit xl:border-r-[1px] xl:border-r-primary-50 dark:xl:border-r-secondary-400">
      <Hamburger onClick={toggleMenu} isActive={isActive} />
      <MainNav isActive={isActive} toggleMenu={toggleMenu}>
        {children}
      </MainNav>
    </div>
  );
}
