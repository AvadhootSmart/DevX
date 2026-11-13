import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes, useId } from "react";

interface LInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isRequired?: boolean;
}
export const LInput: React.FC<LInputProps> = ({
  isRequired,
  label,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="gap-0.5">
        {label}
        {isRequired && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      <Input id={inputId} type="text" required {...props} />
    </div>
  );
};
