'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CompanyCardProps {
  name: string;
  key_: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

function CompanyCard({ name, icon, color, bgColor, borderColor, description, isActive, onClick }: CompanyCardProps) {
  return (
    <button
      onClick={onClick}
      className="company-news-card group"
      style={{
        '--company-color': color,
        '--company-bg': bgColor,
        '--company-border': borderColor,
      } as React.CSSProperties}
      aria-pressed={isActive}
    >
      <div
        className="company-card-inner"
        style={{
          background: isActive ? bgColor : 'var(--bg-card)',
          borderColor: isActive ? color : 'var(--border)',
          boxShadow: isActive ? `0 0 0 2px ${color}30, 0 4px 16px ${color}20` : undefined,
          transform: isActive ? 'translateY(-2px)' : undefined,
        }}
      >
        <div className="company-card-top">
          <div
            className="company-icon-wrap"
            style={{ background: isActive ? `${color}20` : bgColor, borderColor: `${color}30` }}
          >
            <span className="company-icon">{icon}</span>
          </div>
          {isActive && (
            <span className="active-indicator" style={{ background: color }}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        <div className="company-card-body">
          <p className="company-name" style={{ color: isActive ? color : 'var(--text-primary)' }}>{name}</p>
          <p className="company-desc">{description}</p>
        </div>
        <div
          className="company-card-bar"
          style={{ background: isActive ? color : `${color}40` }}
        />
      </div>
    </button>
  );
}

const COMPANIES = [
  {
    name: 'OpenAI',
    key_: 'openai',
    icon: '🤖',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#6EE7B7',
    description: 'GPT, DALL-E & more',
  },
  {
    name: 'Google AI',
    key_: 'google',
    icon: '🔍',
    color: '#0A66C2',
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    description: 'Gemini, DeepMind & more',
  },
  {
    name: 'Anthropic',
    key_: 'anthropic',
    icon: '⚡',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    borderColor: '#FDBA74',
    description: 'Claude AI & research',
  },
  {
    name: 'Meta AI',
    key_: 'meta',
    icon: '🌐',
    color: '#1877F2',
    bgColor: '#EFF6FF',
    borderColor: '#93C5FD',
    description: 'Llama, ImageBind & more',
  },
  {
    name: 'Microsoft',
    key_: 'microsoft',
    icon: '💎',
    color: '#00A4EF',
    bgColor: '#F0FEFF',
    borderColor: '#A5F3FC',
    description: 'Copilot, Azure AI & more',
  },
  {
    name: 'NVIDIA',
    key_: 'nvidia',
    icon: '🚀',
    color: '#76B900',
    bgColor: '#F0FDF4',
    borderColor: '#86EFAC',
    description: 'GPU, CUDA & AI chips',
  },
  {
    name: 'xAI (Grok)',
    key_: 'xai',
    icon: '𝕏',
    color: '#111111',
    bgColor: '#F5F5F5',
    borderColor: '#D4D4D4',
    description: 'Grok AI & research',
  },
];

interface CompanyNewsSectionProps {
  activeCompany?: string;
}

export function CompanyNewsSection({ activeCompany }: CompanyNewsSectionProps) {
  const router = useRouter();
  const params = useSearchParams();

  const handleCompanyClick = (key_: string) => {
    const p = new URLSearchParams(params.toString());
    if (activeCompany === key_) {
      // Toggle off
      p.delete('company');
    } else {
      p.set('company', key_);
    }
    p.delete('page');
    router.push(`/?${p.toString()}`);
  };

  return (
    <div className="company-news-section">
      <div className="company-section-header">
        <div className="company-section-label">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </div>
          <span>Top Companies</span>
        </div>
        <p className="company-section-hint">Click a company to filter news</p>
      </div>

      <div className="company-cards-grid">
        {COMPANIES.map((co) => (
          <CompanyCard
            key={co.key_}
            {...co}
            isActive={activeCompany === co.key_}
            onClick={() => handleCompanyClick(co.key_)}
          />
        ))}
      </div>

      {activeCompany && (
        <div className="company-active-banner">
          <span>
            Showing news for{' '}
            <strong className="text-primary">
              {COMPANIES.find((c) => c.key_ === activeCompany)?.name ?? activeCompany}
            </strong>
          </span>
          <button
            onClick={() => {
              const p = new URLSearchParams(params.toString());
              p.delete('company');
              router.push(`/?${p.toString()}`);
            }}
            className="company-clear-btn"
          >
            ✕ Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
