function Logo({
  dark = true,
  className,
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <img src={`/logo-${dark ? "dark" : "light"}.png`} alt="Logo" />
    </div>
  );
}

export default Logo;
