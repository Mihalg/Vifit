import { Outlet } from "react-router";
import SideBar from "../common/SideBar";
import MainNav from "../navigation/MainNav";
import AddPatientForm from "./AddPatientForm";
import { Input } from "../ui/Input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatientsList } from "@/services/apiPatients";

function Dashboard() {
  const [searchBar, setSearchBar] = useState("");

  const { data } = useQuery({
    queryKey: ["patientsList"],
    queryFn: getPatientsList,
  });

  return (
    <div className="flex flex-col xl:max-h-screen xl:flex-row xl:overflow-hidden">
      <SideBar>
        <div className="mb-4 flex flex-col gap-2 border-b-2 border-b-secondary-300 pb-4">
          <MainNav.NavRow
            to="zaplanowane-wizyty"
          >
            Wizyty
          </MainNav.NavRow>
          <MainNav.NavRow
        
            to="baza"
          >
            Baza posiłków
          </MainNav.NavRow>
          <MainNav.NavRow
           
            to="baza-jadłospisów"
          >
            Baza jadłospisów
          </MainNav.NavRow>
        </div>
        <AddPatientForm />
        <Input
          value={searchBar}
          onChange={(e) => {
            setSearchBar(e.target.value);
          }}
          placeholder="Wyszukaj pacjenta"
        />

        <div className="scrollbar max-h-[30vh] space-y-2 overflow-hidden overflow-y-auto pr-1">
          {data?.map((patient, i) => {
            if (
              patient.users.full_name
                .toLowerCase()
                .includes(searchBar.toLowerCase())
            )
              return (
                <MainNav.NavRow
                  to={patient.users.id ? String(patient.users.id) : ""}
                  key={i}
                >
                  {patient.users.full_name}
                </MainNav.NavRow>
              );
          })}
        </div>
      </SideBar>
      <div className="grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
