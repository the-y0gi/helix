import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";
export type CounterProps = {
  label: string;
  any?: boolean;
};
export default function Counter({
  label,
  any,
}: CounterProps) {
  const [count, setCount] = useQueryState(label.toLowerCase(), parseAsInteger);
  const currentCount = count ?? 0;
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm">{label}</p>
      <div className="flex items-center gap-4">
        <Button className="rounded-full" variant="outline" size="icon" onClick={() => setCount(currentCount > 0 ? currentCount - 1 : 0)}>−</Button>
        <span className="text-sm">{any ? "Any" : currentCount}</span>
        <Button className="rounded-full"  variant="outline" size="icon" onClick={() => setCount(currentCount + 1)}>+</Button>
      </div>
    </div>
  );
}
