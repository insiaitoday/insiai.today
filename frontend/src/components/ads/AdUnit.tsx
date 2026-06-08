/**
 * AdSense ad unit wrapper.
 *
 * HOW TO ACTIVATE:
 * 1. Get your Publisher ID from Google AdSense (format: ca-pub-XXXXXXXXXXXXXXXX)
 * 2. Uncomment the AdSense script tag in layout.tsx and add your Publisher ID
 * 3. Replace SLOT_IDS below with your actual ad slot IDs from AdSense dashboard
 * 4. Uncomment the <ins> tags in the render function below
 */

interface AdUnitProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SLOT_IDS: Record<AdUnitProps['slot'], string> = {
  'header':     'XXXXXXXXXX', // Replace with your Header slot ID
  'sidebar':    'XXXXXXXXXX', // Replace with your Sidebar slot ID
  'in-content': 'XXXXXXXXXX', // Replace with your In-Content slot ID
  'footer':     'XXXXXXXXXX', // Replace with your Footer slot ID
};

// Size map: width x height for each placement
const SLOT_SIZES: Record<AdUnitProps['slot'], { w: number; h: number }> = {
  'header':     { w: 728, h: 90 },
  'sidebar':    { w: 300, h: 250 },
  'in-content': { w: 336, h: 280 },
  'footer':     { w: 728, h: 90 },
};

export function AdUnit({ slot, className = '' }: AdUnitProps) {
  const size = SLOT_SIZES[slot];

  return (
    <div
      className={className}
      style={{ minWidth: size.w, minHeight: size.h, display: 'block' }}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* Actual AdSense ins tag — uncomment after AdSense approval and add your IDs:
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: size.w, height: size.h }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={SLOT_IDS[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      */}
    </div>
  );
}
