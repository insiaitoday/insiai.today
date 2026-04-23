/**
 * AdSense ad unit wrapper.
 * Replace data-ad-slot with your actual slot IDs after AdSense approval.
 * Add your Publisher ID to layout.tsx's AdSense script tag.
 */

interface AdUnitProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SLOT_CONFIG: Record<AdUnitProps['slot'], { label: string; style: string }> = {
  'header':     { label: 'Header Ad (728×90)',     style: 'h-24 min-w-[728px]' },
  'sidebar':    { label: 'Sidebar Ad (300×250)',   style: 'h-[250px] w-[300px]' },
  'in-content': { label: 'In-Content Ad (336×280)', style: 'h-[280px] w-[336px]' },
  'footer':     { label: 'Footer Ad (728×90)',     style: 'h-24' },
};

export function AdUnit({ slot, className = '' }: AdUnitProps) {
  const config = SLOT_CONFIG[slot];

  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-background-elevated/30 text-text-muted text-xs ${config.style} ${className}`}
      aria-label="Advertisement"
      role="region"
    >
      {/* Placeholder — replace with actual AdSense ins tag */}
      <div className="text-center opacity-40">
        <div className="text-sm mb-1">Advertisement</div>
        <div className="text-[10px] mt-0.5">{config.label}</div>
      </div>

      {/* Actual AdSense code — uncomment after approval:
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      */}
    </div>
  );
}
