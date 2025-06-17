import { cn } from './utils';

export function Card({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4 shadow-sm transition-colors',
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}
