import { Button } from "@/components/ui/Button";
import { useMoveBack } from "@/hooks/useMoveBack";

export default function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <div className="flex h-dvh items-center justify-center p-20">
      <div className="flex flex-col items-center justify-center gap-6 rounded-md bg-primary-50 p-20">
        <p className="text-xl font-semibold">
          Strona, której szukasz, nie została znaleziona 😢
        </p>
        <Button
          onClick={() => {
            void moveBack();
          }}
        >
          &larr; Powrót
        </Button>
      </div>
    </div>
  );
}
