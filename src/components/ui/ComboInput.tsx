import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Control,
  FieldValues,
  Path,
  useController,
  UseFormRegister,
} from "react-hook-form";

type Option = { id: number; name: string };

type ComboInputProps<FormFields extends FieldValues> = {
  queryKey: string;
  queryFunction: () => Promise<Option[]>;
  inputId: Path<FormFields>;
  register: UseFormRegister<FormFields>;
  control: Control<FormFields, unknown>;
  defaultValue?: string;
};

export default function ComboInput<FormFields extends FieldValues>({
  queryKey,
  queryFunction,
  inputId,
  control,
  defaultValue = "",
}: ComboInputProps<FormFields>) {
  const [options, setOptions] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [selected, setSelected] = useState<Option | null>(null);
  const { field } = useController({
    name: inputId,
    control,
    rules: { required: true },
  });

  const { data } = useQuery({ queryKey: [queryKey], queryFn: queryFunction });

  useEffect(() => {
    if (data) setOptions(data);
  }, [data]);

  const handleSelect = (option: Option) => {
    field.onChange(option.name);
    setSelected(option);
    setInputValue(option.name);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            onChange={(e) => {
              field.onChange(e.target.value);
              setInputValue(e.target.value);
            }}
            value={inputValue}
            onClick={() => {
              setOpen(true);
            }}
            placeholder="Wpisz lub wybierz..."
            id={inputId as string}
            name={field.name}
            required
            autoComplete="off"
          />
          <ChevronsUpDown className="text-muted-foreground absolute right-2 top-2.5 h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="p-0">
          <CommandInput placeholder="Szukaj..." />
          <CommandEmpty>Brak wyników.</CommandEmpty>
          <CommandGroup className="max-h-[250px] overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  handleSelect(option);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
