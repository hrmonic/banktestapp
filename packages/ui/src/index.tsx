/**
 * Design system léger pour le backoffice (Button, Card, PageLayout, VirtualizedList).
 */
import React from 'react';
import { VirtualizedList } from './VirtualizedList';

type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps): React.ReactElement {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-60',
    ghost: 'bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500',
    subtle:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400',
    secondary:
      'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
  };
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type CardVariant = 'default' | 'error';

type CardProps = {
  title?: string;
  description?: string;
  variant?: CardVariant;
  children?: React.ReactNode;
  className?: string;
};

export function Card({
  title,
  description,
  variant = 'default',
  children,
  className = '',
}: CardProps): React.ReactElement {
  const isError = variant === 'error';
  const borderClass = isError ? 'border-red-200' : 'border-slate-200';
  const titleClass = isError
    ? 'text-lg font-semibold text-red-900'
    : 'text-lg font-semibold text-slate-900';
  const descClass = isError
    ? 'mt-1 text-sm text-red-700'
    : 'mt-1 text-sm text-slate-600';

  return (
    <section
      className={`rounded-lg border ${borderClass} bg-white p-6 shadow-sm ${className}`}
    >
      {(title != null || description != null) && (
        <header className="mb-4">
          {title != null && <h2 className={titleClass}>{title}</h2>}
          {description != null && <p className={descClass}>{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

type PageLayoutProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export function PageLayout({
  title,
  subtitle,
  children,
}: PageLayoutProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {(title != null || subtitle != null) && (
        <header>
          {title != null && (
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
          )}
          {subtitle != null && (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </div>
  );
}

type PlaceholderProps = {
  children?: React.ReactNode;
};

export function Placeholder({
  children,
}: PlaceholderProps): React.ReactElement {
  return (
    <div className="rounded border border-dashed border-slate-300 p-2 text-sm text-slate-500">
      {children ?? 'UI Placeholder'}
    </div>
  );
}

export { VirtualizedList };

export default {
  Button,
  Card,
  PageLayout,
  Placeholder,
  VirtualizedList,
};
