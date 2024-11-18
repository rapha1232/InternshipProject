import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  className,
  onChange,
  value,
  placeholder,
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 px-3.5 py-2 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Input
        type="search"
        placeholder={placeholder ? placeholder : "Search ..."}
        className="w-full h-8 font-semibold focus-visible:ring-transparent border-none"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
