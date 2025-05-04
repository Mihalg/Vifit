function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen items-center">
      <div className="mx-auto max-w-[1200px] space-y-4 rounded bg-secondary-400 px-6 py-4 lg:my-6">
        <h1 className="text-2xl">Polityka prywatności aplikacji NutriPath</h1>
        <p>Ostatnia aktualizacja: 25.04.2025</p>

        <p>
          Administratorem danych osobowych jest Michał Grembocki, prowadzący
          działalność nierejestrowaną jako osoba fizyczna.
        </p>
        <p>
          Kontakt:{" "}
          <a href="mailto:michalgrembocki@gmail.com">
            michalgrembocki@gmail.com
          </a>
        </p>

        <h2>1. Jakie dane zbieramy</h2>
        <ul>
          <li>Imię i nazwisko użytkownika (dietetyka/trenera)</li>
          <li>Adres e-mail</li>
          <li>
            Dane zdrowotne pacjentów wprowadzane przez użytkowników (np. masa
            ciała, historia zdrowotna, zalecenia dietetyczne)
          </li>
        </ul>

        <h2>2. Cel i podstawa prawna przetwarzania danych</h2>
        <p>Dane są przetwarzane w celu:</p>
        <ul>
          <li>
            umożliwienia logowania i korzystania z aplikacji (art. 6 ust. 1 lit.
            b RODO – wykonanie umowy)
          </li>
          <li>
            przechowywania danych pacjentów przez dietetyków (art. 9 ust. 2 lit.
            a RODO – wyraźna zgoda pacjenta)
          </li>
        </ul>
        <p>
          Dietetycy i trenerzy są zobowiązani do uzyskania zgody pacjentów na
          przetwarzanie danych zdrowotnych.
        </p>

        <h2>3. Komu powierzamy dane</h2>
        <p>
          Dane są przechowywane na serwerach Supabase Inc., dostawcy backendu i
          bazy danych, z siedzibą w USA/EOG, na podstawie standardowych klauzul
          umownych (SCC).
        </p>
        <p>
          Wysyłka e-maili (np. potwierdzenie rejestracji, przypomnienie hasła)
          może odbywać się przez usługę SendGrid.
        </p>

        <h2>4. Twoje prawa</h2>
        <ul>
          <li>Dostęp do swoich danych</li>
          <li>Poprawienie danych</li>
          <li>Usunięcie danych</li>
          <li>Ograniczenie przetwarzania</li>
          <li>Sprzeciw wobec przetwarzania</li>
          <li>Przenoszenie danych</li>
        </ul>
        <p>
          Aby skorzystać z powyższych praw, skontaktuj się z nami:{" "}
          <a href="mailto:michalgrembocki@gmail.com">
            michalgrembocki@gmail.com
          </a>
        </p>

        <h2>5. Przechowywanie danych</h2>
        <p>
          Dane przechowywane są przez okres korzystania z aplikacji oraz
          maksymalnie 6 miesięcy po jej opuszczeniu, chyba że wcześniej zgłosisz
          żądanie ich usunięcia.
        </p>

        <h2>6. Zabezpieczenia</h2>
        <ul>
          <li>Szyfrowanie transmisji danych (HTTPS)</li>
          <li>Uwierzytelnianie użytkowników</li>
          <li>Ograniczony dostęp do danych</li>
        </ul>

        <h2>7. Pliki cookies</h2>
        <p>
          Aplikacja nie używa plików cookies w celach marketingowych ani
          analitycznych. Stosowane są wyłącznie techniczne cookies niezbędne do
          prawidłowego działania aplikacji.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
