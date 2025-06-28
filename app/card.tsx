import { cn } from './utils';

export function Card({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm transition-colors',
        'dark:border-slate-700 dark:bg-slate-800',
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="">{children}</div>;
}
