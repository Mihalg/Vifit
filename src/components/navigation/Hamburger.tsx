type HamburgerProps = {
  onClick: () => void;
  isActive: boolean;
};

export default function Hamburger({ onClick, isActive }: HamburgerProps) {
  return (
    <button
      onClick={onClick}
      className={`hamburger hamburger--collapse xl:hidden ${isActive ? "is-active" : ""}`}
      type="button"
    >
      <span className="hamburger-box">
        <span className="hamburger-inner"></span>
      </span>
    </button>
  );
}
