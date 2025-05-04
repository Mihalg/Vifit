import { Button } from "./ui/Button";

function ErrorFalback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex flex-col items-center gap-10 rounded-md bg-white px-8 py-8 text-secondary-400 md:px-24 md:py-16 lg:px-44 lg:py-24">
        <p className="text-3xl md:text-4xl">Coś poszło nie tak 🤔</p>
        <Button className="max-w-fit" onClick={resetErrorBoundary}>
          Powrót na stronę główną
        </Button>
      </div>
    </div>
  );
}

export default ErrorFalback;
