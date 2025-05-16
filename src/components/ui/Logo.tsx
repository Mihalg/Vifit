import { UseDarkModeContext } from "../ThemeProvider";


function Logo({ className }: { className?: string }) {
  const { isDarkModeOn } = UseDarkModeContext();

  return (
    <div className={className}>
      <img src={`/logo-${isDarkModeOn ? "light" : "dark"}.png`} alt="Logo" />
    </div>
  );
}

export default Logo;
