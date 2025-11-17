import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface StateComboboxProps {
  value: string;
  onValueChange: (val: string) => void;
  options?: ComboboxOption[];
  disabled?: boolean;
  placeholder?: string;
}

export function StateCombobox({
  value,
  onValueChange,
  options = [],
  disabled = false,
  placeholder = "Selecione um estado",
}: StateComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = (options || []).filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    onValueChange(val);
    setIsOpen(false);
    setSearch("");
  };

  const selectedLabel = (options || []).find((opt) => opt.value === value)?.label || "";

  return (
    <div className="relative w-full">
      <Input
        value={isOpen ? search : selectedLabel}
        onChange={(e) => setSearch(e.target.value)}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        className="pr-8"
      />

      {isOpen && !disabled && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
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
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhum estado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}
