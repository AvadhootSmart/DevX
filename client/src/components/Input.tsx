import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

interface LInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isRequired?: boolean;
}
export const LInput: React.FC<LInputProps> = ({
  isRequired,
  label,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="input-02" className="text-lg font-Montserrat">
        {label}
        {isRequired && <span className="text-red-400">*</span>}
      </Label>
      <Input
        id="input-02"
        type="text"
        required
        className="font-Montserrat"
        {...props}
      />
    </div>
  );
};
