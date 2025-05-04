function Regulations() {
  return (
    <div className="flex min-h-screen items-center">
      <div className="mx-auto max-w-[1200px] space-y-4 rounded bg-secondary-400 px-6 py-4">
        <h1 className="text-2xl">Regulamin aplikacji NutriPath</h1>
        <p>Ostatnia aktualizacja: 25.04.2025</p>

        <h2>§1. Postanowienia ogólne</h2>
        <ol>
          <li>
            Aplikacja NutriPath jest prowadzona przez Michała Grembockiego jako
            osoba fizyczna.
          </li>
          <li>
            Korzystanie z aplikacji oznacza akceptację niniejszego Regulaminu.
          </li>
        </ol>

        <h2>§2. Rejestracja i konto użytkownika</h2>
        <ol>
          <li>
            Rejestracja w aplikacji jest dobrowolna, ale konieczna do
            korzystania z pełnej funkcjonalności.
          </li>
          <li>Użytkownik zobowiązany jest do podania prawdziwych danych.</li>
          <li>Każdy użytkownik odpowiada za bezpieczeństwo swojego konta.</li>
        </ol>

        <h2>§3. Obowiązki użytkownika</h2>
        <ol>
          <li>
            Użytkownik zobowiązuje się do przestrzegania prawa i nieumieszczania
            nielegalnych treści.
          </li>
          <li>
            Dietetycy i trenerzy personalni są odpowiedzialni za uzyskanie zgody
            pacjenta przed wprowadzeniem jego danych zdrowotnych do systemu.
          </li>
        </ol>

        <h2>§4. Zakres odpowiedzialności</h2>
        <ol>
          <li>
            Administrator nie ponosi odpowiedzialności za błędne lub nielegalne
            dane wprowadzone przez użytkowników.
          </li>
          <li>
            Administrator nie udziela porad medycznych – aplikacja jest
            narzędziem wspomagającym pracę specjalistów.
          </li>
        </ol>

        <h2>§5. Rozwiązanie umowy</h2>
        <ol>
          <li>Użytkownik może w każdej chwili usunąć swoje konto.</li>
          <li>
            Administrator może usunąć konto użytkownika naruszającego regulamin.
          </li>
        </ol>

        <h2>§6. Reklamacje i kontakt</h2>
        <ol>
          <li>
            Reklamacje można zgłaszać na adres e-mail:{" "}
            <a href="mailto:michalgrembocki@gmail.com" className="underline">
              michalgrembocki@gmail.com
            </a>
          </li>
          <li>Odpowiedź zostanie udzielona w ciągu 14 dni roboczych.</li>
        </ol>

        <h2>§7. Zmiany regulaminu</h2>
        <ol>
          <li>Administrator zastrzega sobie prawo do zmiany regulaminu.</li>
          <li>
            Zmiany wchodzą w życie po 7 dniach od ich opublikowania w aplikacji.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Regulations;
