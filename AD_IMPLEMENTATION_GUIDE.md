# Quick Ad Implementation Guide - Complete

## 🎯 Your Current Ad Setup

I can see you already have `AdUnit.tsx` component ready! It's currently showing placeholders. Let's activate it with real ads.

---

## 🚀 Option 1: PropellerAds (Start TODAY - No Approval Needed)

### Step 1: Sign Up (5 minutes)
1. Go to: **propellerads.com**
2. Sign up as Publisher
3. Add website: `leviai.today`
4. **Instant approval!** ✅

### Step 2: Get Ad Code
After signup, you'll get code like:
```html
<script async src="https://propellerads.com/js/12345.js"></script>
```

### Step 3: Update AdUnit.tsx

Replace the placeholder in `frontend/src/components/ads/AdUnit.tsx`:

```typescript
'use client';

import { useEffect } from 'react';

interface AdUnitProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SLOT_CONFIG: Record<AdUnitProps['slot'], { label: string; style: string; zoneId: string }> = {
  'header':     { label: 'Header Ad (728×90)',     style: 'h-24 min-w-[728px]', zoneId: 'ZONE_ID_1' },
  'sidebar':    { label: 'Sidebar Ad (300×250)',   style: 'h-[250px] w-[300px]', zoneId: 'ZONE_ID_2' },
  'in-content': { label: 'In-Content Ad (336×280)', style: 'h-[280px] w-[336px]', zoneId: 'ZONE_ID_3' },
  'footer':     { label: 'Footer Ad (728×90)',     style: 'h-24', zoneId: 'ZONE_ID_4' },
};

export function AdUnit({ slot, className = '' }: AdUnitProps) {
  const config = SLOT_CONFIG[slot];

  useEffect(() => {
    // Load PropellerAds script
    const script = document.createElement('script');
    script.src = `https://propellerads.com/js/${config.zoneId}.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [config.zoneId]);

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${config.style} ${className}`}
      aria-label="Advertisement"
      role="region"
      id={`propeller-${slot}`}
    />
  );
}
```

**Replace `ZONE_ID_1`, `ZONE_ID_2`, etc. with your actual PropellerAds zone IDs**

### Step 4: Deploy
```bash
cd frontend
npm run build
npm start
```

**You're now earning!** 💰

---

## 💰 Option 2: Media.net (Better Rates - Apply After 100 Visitors)

### Step 1: Sign Up
1. Go to: **media.net**
2. Apply as Publisher
3. Wait 2-3 days for approval

### Step 2: Get Ad Code
After approval:
```html
<script src="https://contextual.media.net/dmedianet.js?cid=YOUR_CID" async></script>
<div id="YOUR_DIV_ID"></div>
```

### Step 3: Update AdUnit.tsx

```typescript
'use client';

import { useEffect } from 'react';

interface AdUnitProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SLOT_CONFIG: Record<AdUnitProps['slot'], { 
  label: string; 
  style: string; 
  divId: string;
  size: string;
}> = {
  'header':     { label: 'Header Ad', style: 'h-24 min-w-[728px]', divId: 'div-gpt-ad-header', size: '728x90' },
  'sidebar':    { label: 'Sidebar Ad', style: 'h-[250px] w-[300px]', divId: 'div-gpt-ad-sidebar', size: '300x250' },
  'in-content': { label: 'In-Content Ad', style: 'h-[280px] w-[336px]', divId: 'div-gpt-ad-content', size: '336x280' },
  'footer':     { label: 'Footer Ad', style: 'h-24', divId: 'div-gpt-ad-footer', size: '728x90' },
};

export function AdUnit({ slot, className = '' }: AdUnitProps) {
  const config = SLOT_CONFIG[slot];

  useEffect(() => {
    // Load Media.net script
    if (typeof window !== 'undefined' && !(window as any)._mNHandle) {
      const script = document.createElement('script');
      script.src = 'https://contextual.media.net/dmedianet.js?cid=YOUR_CID';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize ad
    if ((window as any)._mNHandle) {
      (window as any)._mNHandle.queue.push(() => {
        (window as any)._mNDetails.loadTag(config.divId, config.size, config.divId);
      });
    }
  }, [config]);

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${config.style} ${className}`}
      aria-label="Advertisement"
      role="region"
    >
      <div id={config.divId}></div>
    </div>
  );
}
```

**Replace `YOUR_CID` with your Media.net Customer ID**

---

## 🎯 Option 3: Google AdSense (Apply After 6-8 Weeks)

### Step 1: Prepare Your Site

**Before applying, ensure**:
- [ ] 30+ published articles
- [ ] Each article 300+ words
- [ ] 150+ daily visitors
- [ ] Site live for 6-8 weeks
- [ ] All essential pages complete

### Step 2: Apply
1. Go to: **google.com/adsense**
2. Sign up with Google account
3. Add your website
4. Wait 1-2 weeks for review

### Step 3: Add AdSense Code

**In `frontend/src/app/layout.tsx`**, add:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Update AdUnit.tsx

```typescript
'use client';

import { useEffect } from 'react';

interface AdUnitProps {
  slot: 'header' | 'sidebar' | 'in-content' | 'footer';
  className?: string;
}

const SLOT_CONFIG: Record<AdUnitProps['slot'], { 
  label: string; 
  style: string; 
  adSlot: string;
  format: string;
}> = {
  'header':     { label: 'Header Ad', style: 'h-24 min-w-[728px]', adSlot: '1234567890', format: 'horizontal' },
  'sidebar':    { label: 'Sidebar Ad', style: 'h-[250px] w-[300px]', adSlot: '0987654321', format: 'rectangle' },
  'in-content': { label: 'In-Content Ad', style: 'h-[280px] w-[336px]', adSlot: '1122334455', format: 'rectangle' },
  'footer':     { label: 'Footer Ad', style: 'h-24', adSlot: '5544332211', format: 'horizontal' },
};

export function AdUnit({ slot, className = '' }: AdUnitProps) {
  const config = SLOT_CONFIG[slot];

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div
      className={`flex items-center justify-center rounded-lg ${config.style} ${className}`}
      aria-label="Advertisement"
      role="region"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={config.adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

**Replace**:
- `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID
- `adSlot` values with your actual ad slot IDs

---

## 📊 Revenue Comparison

### With 1,000 Daily Visitors:

| Network | Setup Time | Approval | Daily Revenue |
|---------|------------|----------|---------------|
| PropellerAds | 15 min | Instant | $1-3 |
| Media.net | 1 hour | 2-3 days | $3-8 |
| AdSense | 1 hour | 1-2 weeks | $2-8 |
| Ezoic | 2 hours | 1 week | $10-30 |

---

## 🎯 Recommended Timeline

### Week 1 (TODAY):
1. ✅ Sign up for **PropellerAds**
2. ✅ Add ad code to site
3. ✅ Start earning immediately
4. ✅ Publish 20 articles

### Week 2-4:
5. ✅ Build traffic to 100+ daily visitors
6. ✅ Apply to **Media.net**
7. ✅ Replace PropellerAds with Media.net

### Week 6-8:
8. ✅ Reach 150+ daily visitors
9. ✅ Apply to **Google AdSense**
10. ✅ Use AdSense + Media.net together

### Month 3+:
11. ✅ Reach 10k+ monthly visitors
12. ✅ Apply to **Ezoic**
13. ✅ Maximize revenue

---

## 💡 Pro Tips

### Ad Placement Best Practices:

**✅ Good Placements**:
- Above the fold (visible without scrolling)
- Between content (after 3-5 paragraphs)
- Sidebar (desktop only)
- End of article

**❌ Bad Placements**:
- Too many ads (max 3 per page)
- Blocking content
- Pop-ups (annoying)
- Auto-play videos

### Your Current Placements (Already Good!):
- ✅ Sidebar ad (line 141-145 in page.tsx)
- ✅ In-content ad after 5th post (line 106-110)
- ✅ Non-intrusive

---

## 🚀 Quick Start (Next 30 Minutes)

### Step 1: Sign Up PropellerAds (10 min)
1. Go to propellerads.com
2. Sign up as Publisher
3. Add leviai.today
4. Create 3 ad zones (sidebar, in-content, footer)

### Step 2: Get Zone IDs (5 min)
You'll get IDs like:
- Sidebar: `12345`
- In-content: `67890`
- Footer: `11223`

### Step 3: Update Code (10 min)
1. Open `frontend/src/components/ads/AdUnit.tsx`
2. Replace placeholder with PropellerAds code (see above)
3. Add your zone IDs

### Step 4: Deploy (5 min)
```bash
cd frontend
npm run build
npm start
```

**Done! You're earning! 💰**

---

## 📞 Need Help?

### Common Issues:

**Q: Ads not showing?**
A: Check browser console for errors, verify zone IDs

**Q: Low revenue?**
A: Need more traffic, try Media.net or AdSense

**Q: AdSense rejected?**
A: Need more content (30+ articles) and traffic (150+ daily)

**Q: Which network is best?**
A: 
- Start: PropellerAds (instant)
- Growth: Media.net (better rates)
- Scale: AdSense + Ezoic (maximum revenue)

---

## ✅ Action Checklist

### Today (April 11, 2026):
- [ ] Sign up for PropellerAds
- [ ] Create 3 ad zones
- [ ] Update AdUnit.tsx with zone IDs
- [ ] Deploy to production
- [ ] Start earning!

### This Week:
- [ ] Publish 20 articles
- [ ] Share on social media
- [ ] Build traffic

### Next Month:
- [ ] Apply to Media.net
- [ ] Apply to AdSense
- [ ] Optimize ad placements

---

## 🎉 Summary

**Best approach for you**:

1. **TODAY**: PropellerAds (instant approval, start earning)
2. **Week 4**: Media.net (better rates for tech)
3. **Week 8**: Google AdSense (backup/additional)
4. **Month 3**: Ezoic (maximize revenue)

**Expected revenue timeline**:
- Week 1: $1-3/day (PropellerAds)
- Month 1: $3-8/day (Media.net)
- Month 2: $5-15/day (AdSense + Media.net)
- Month 3+: $10-30/day (Ezoic)

**Start now and you'll be earning by tonight! 🚀**

Need help with implementation? Let me know!
