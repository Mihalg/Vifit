import supabase from "./supabase";


export async function generateMenu(menuData: {
  name: string;
  numberOfMeals: number;
  excludedIngredients: string;
  goal: string;
  diseases: string;
} ){


//   * **nazwa_jadłospisu**: Jadłospis redukcyjny 1800 kcal
// * **liczba_posiłków**: 5 
// * **liczba_dań_w_każdym_posiłku**: 8 
// * **cel**: Utrata wagi przy umiarkowanej aktywności fizycznej
// * **choroby**: []
// * **wykluczone_składniki**: [ "gluten", "laktoza" ]

  const query = Object.entries(menuData).map(item => `* **${item[0]}**: ${item[1]}`).join('\n')


  const userInput =`Wygeneruj jadłospis w formacie JSON, który będzie zawierał następujące informacje: 
                ${query}
* **liczba_dań_w_każdym_posiłku**: 3
* **posiłki**: Lista obiektów JSON, gdzie każdy obiekt reprezentuje jeden posiłek i zawiera:
    * **nazwa**: Nazwa posiłku (np. Śniadanie, Obiad, Kolacja, Przekąska).
    * ** kaloryczność**: Przybliżona kaloryczność posiłku
    * **potrawy**: Lista obiektów JSON, gdzie każdy obiekt reprezentuje jedną potrawę i zawiera:
        * **nazwa**: Nazwa potrawy (np. Owsianka z owocami, Grillowany kurczak z warzywami).
        * **grupa**: Grupa, do której należy potrawa (np. Śniadania, Obiady, Kolacje, Przekąski).
        * **kategoria**: Kategoria potrawy (np. Zbożowe, Mięsne, Warzywne, Owocowe).
        * **sposób_przygotowania**: Instrukcja przygotowania posiłku.
        * **składniki**: Lista obiektów JSON, gdzie każdy obiekt reprezentuje jeden składnik i zawiera:
            * **nazwa**: Nazwa składnika (np. Płatki owsiane, Pierś z kurczaka, Brokuły).
            * **kategoria**: Kategoria składnika (np. Zboża, Białka, Warzywa, Owoce).
            * **ilość**: Przybliżona ilość użytego składnika (np. 50g, 150g, jedna średnia sztuka, pół szklanki).
            * **kaloryczność**: kaloryczność /100 jednostek miary
            * **makroskładniki**: węglowodany, białko, tłuszcz /100 jednostek miary

Proszę, aby wygenerowany jadłospis był zróżnicowany i uwzględniał podane wytyczne. Odpowiedź  wygeneruj wyłącznie w formacie JSON – bez dodatkowych wyjaśnień i komentarzy. `



    const { data, error } = await supabase.functions.invoke<string>('generate-meal-plan', {
      body: {userInput},
    })

if(error){
    console.error(error);
    throw new Error('Nie udało się stworzyć jadłospisu. Spróbuj ponownie później')
}

return data 
}