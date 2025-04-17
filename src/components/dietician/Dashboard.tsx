import { Outlet } from "react-router";
import SideBar from "../SideBar";
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
    <div className="flex flex-col xl:max-h-screen xl:flex-row xl:overflow-auto">
      <SideBar>
        <div className="mb-4 flex flex-col gap-2 border-b-2 border-b-secondary-300 pb-4">
          <MainNav.NavRow
            className="bg-primary-600 text-white hover:bg-primary-800"
            to="zaplanowane-wizyty"
          >
            Wizyty
          </MainNav.NavRow>
          <MainNav.NavRow
            className="bg-primary-600 text-white hover:bg-primary-800 hover:text-white"
            to="baza"
          >
            Baza posiłków
          </MainNav.NavRow>
          <MainNav.NavRow
            className="bg-primary-600 text-white hover:bg-primary-800 hover:text-white"
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

        {data
          ? data.map((patient, i) => {
              if (searchBar) {
                if (patient.users.full_name.toLowerCase().includes(searchBar)) {
                  return (
                    <MainNav.NavRow
                      className="py-1 text-xl"
                      to={patient.users.id ? String(patient.users.id) : ""}
                      key={i}
                    >
                      {patient.users.full_name}
                    </MainNav.NavRow>
                  );
                }
              } else
                return (
                  <MainNav.NavRow
                    className="py-1 text-xl"
                    to={patient.users.id ? String(patient.users.id) : ""}
                    key={i}
                  >
                    {patient.users.full_name}
                  </MainNav.NavRow>
                );
            })
          : null}
      </SideBar>
      <div className="w-full max-h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
