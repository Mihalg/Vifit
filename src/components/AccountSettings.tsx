import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

function AccountSettings() {
  return (
    <div className="h-full px-4 py-4">
      <p className="mb-7 text-3xl">Ustawienia konta</p>
      <form className="rounded-md px-4 py-4 shadow-md">
        <p className="mb-2 text-2xl text-primary-600">Zmień hasło</p>
        <div>
          <Label htmlFor="password">Nowe hasło</Label>
          <Input type="password" id="password" name="password" />
        </div>
        <div className="mb-4 mt-2">
          <Label htmlFor="password">Powtórz hasło</Label>
          <Input type="password" id="password-repeat" name="password-repeat" />
        </div>
        <Button className="ml-auto block">Zapisz</Button>
      </form>
    </div>
  );
}

export default AccountSettings;
