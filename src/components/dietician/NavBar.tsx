import { useState } from "react";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { VscBook } from "react-icons/vsc";
import Hamburger from "../navigation/Hamburger";
import MainNav from "../navigation/MainNav";

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);

  function toggleMenu() {
    setIsActive((state) => !state);
  }

  return (
    <div className="xl:border-r-primary-50 z-10 flex items-center justify-between px-3 py-4 xl:h-dvh xl:flex-col xl:border-r-[1px] xl:px-1">
      {/* <Logo /> */}
      <Hamburger onClick={toggleMenu} isActive={isActive} />

      <MainNav isActive={isActive} toggleMenu={toggleMenu}>
        <MainNav.NavRow to={"home"}>
          <HiHome />
          <span>Home</span>
        </MainNav.NavRow>

        <MainNav.NavRow
          nestedLinks={
            <>
              <MainNav.NavRowNested to="sprzedaz/faktury">
                <span>Faktury Sprzedaży</span>
              </MainNav.NavRowNested>
            </>
          }
        >
          <GiReceiveMoney />
          <span>Sprzedaż</span>
        </MainNav.NavRow>

        <MainNav.NavRow
          nestedLinks={
            <>
              <MainNav.NavRowNested to="zakup/faktury">
                <span>Faktury zakupu</span>
              </MainNav.NavRowNested>
            </>
          }
        >
          <GiPayMoney />
          <span>Zakup</span>
        </MainNav.NavRow>
        <MainNav.NavRow
          nestedLinks={
            <>
              <MainNav.NavRowNested to="kartoteki/towary">
                <span>Towary</span>
              </MainNav.NavRowNested>
              <MainNav.NavRowNested to="kartoteki/kontrahenci">
                <span>Kontrahenci</span>
              </MainNav.NavRowNested>
            </>
          }
        >
          <VscBook />
          <span>Kartoteki</span>
        </MainNav.NavRow>
      </MainNav>
    </div>
  );
}
