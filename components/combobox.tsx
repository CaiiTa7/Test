import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { useState } from "react";
import { Input } from "./input";

interface ComboboxProps {
options: { value: string; label: string }[]
onSelect: (value: string) => void
placeholder?: string
}

export function Combobox({ options, onSelect, placeholder }: ComboboxProps) {
const [isOpen, setIsOpen] = useState(false)
const [searchTerm, setSearchTerm] = useState('')

const filteredOptions = options.filter(option =>
  option.label.toLowerCase().includes(searchTerm.toLowerCase())
)

return (
  <Combobox value={searchTerm} onValueChange={setSearchTerm}>
    <ComboboxTrigger>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </ComboboxTrigger>
    <ComboboxContent>
      {isOpen && (
        <ComboboxList>
          {filteredOptions.map((option) => (
            <ComboboxItem key={option.value} value={option.value} onMouseDown={() => {
              onSelect(option.value)
              setSearchTerm(option.label)
            }}>
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      )}
    </ComboboxContent>
  </Combobox>
)
}

