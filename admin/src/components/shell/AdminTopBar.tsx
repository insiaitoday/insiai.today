'use client';

interface AdminTopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminTopBar({ title, subtitle, actions }: AdminTopBarProps) {
  return (
    <div className="flex items-center justify-between mb-4 lg:mb-6 pb-4 border-b border-border">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:text-white hover:bg-background-elevated transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-text-secondary text-xs lg:text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
