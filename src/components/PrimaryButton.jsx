// Example reusable button component using ShadCN UI and Tailwind
import { Button } from "@shadcn/ui/button";

export default function PrimaryButton({ children, ...props }) {
  return (
    <Button className="bg-blue-600 hover:bg-blue-700 text-white" {...props}>
      {children}
    </Button>
  );
}
