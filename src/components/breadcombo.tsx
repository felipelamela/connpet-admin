import { useState, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ComboboxOption {
  value: string;
  label: string;
}

interface BreedComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  options: ComboboxOption[];
  disabled?: boolean;
  placeholder?: string;
  label?: ReactNode;
  emptyMessage?: string;
}

export function BreedCombobox({
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder = "Selecione uma raça",
  label = "Raça",
  emptyMessage = "Nenhuma opção encontrada",
}: BreedComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // impedir o fechamento imediato
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    onValueChange(val);
    setIsOpen(false);
    setSearch("");
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative w-full">
      {label && <Label className="pb-2">{label}</Label>}
      <Input
        value={isOpen ? search : selectedLabel}
        onChange={(e) => setSearch(e.target.value)}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
      />
      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md border bg-white shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                  value === opt.value ? "bg-gray-200" : ""
                }`}
              >
                {opt.label}
                {value === opt.value && <Check className="h-4 w-4 text-green-600" />}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">{emptyMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}
