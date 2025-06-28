import { cn } from './utils';

export function Button({
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium',
        'bg-slate-800 text-white hover:bg-slate-700',
        'transition-colors shadow-sm',
        className
      )}
      {...props}
    />
  );
}
