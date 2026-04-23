import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — LeviAI Today',
  description: 'Privacy policy for LeviAI Today — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  const date = 'April 10, 2025';
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: {date}</p>

      <div className="space-y-6 text-text-secondary">
        {[
          {
            title: '1. Information We Collect',
            content: `We collect minimal information to provide our services. When you submit a comment, we collect your name, email address, and IP address for moderation purposes. When you subscribe to our newsletter, we collect your email address. We do not require account registration to browse or interact with our platform.`,
          },
          {
            title: '2. How We Use Your Information',
            content: `Your email address is used solely to send you the newsletter digest you subscribed to. Comment information is used for moderation and to display your name next to your comment. We never sell your data to third parties. IP addresses are used solely for rate limiting and spam prevention.`,
          },
          {
            title: '3. Cookies',
            content: `We use essential cookies to remember your vote preferences and improve your experience. We may use analytics cookies (Google Analytics) to understand site traffic. You can disable cookies in your browser settings, though some features may not work as expected.`,
          },
          {
            title: '4. Third-Party Services',
            content: `We use Supabase for database hosting, Vercel for hosting, Google AdSense for advertising, and Resend for email delivery. These services have their own privacy policies. External links to news sources are provided for your convenience; we are not responsible for their privacy practices.`,
          },
          {
            title: '5. Data Retention',
            content: `Comments are retained for as long as the associated post exists. Newsletter subscribers can unsubscribe at any time by clicking the unsubscribe link in any email. Analytics data is retained for 90 days.`,
          },
          {
            title: '6. Your Rights',
            content: `You have the right to access, correct, or delete your personal data. To request data deletion or access, contact us at privacy@leviai.today. For EU/GDPR users, you have additional rights under the General Data Protection Regulation.`,
          },
          {
            title: '7. Advertising',
            content: `We use Google AdSense to display advertisements. Google may use cookies to serve targeted ads based on your interests. You can opt out of personalized advertising via Google's Ad Settings. All ads are clearly labeled as "Advertisement."`,
          },
          {
            title: '8. Contact Us',
            content: `For any privacy-related questions, contact us at privacy@leviai.today or through our contact page.`,
          },
        ].map((section) => (
          <div key={section.title} className="card p-5">
            <h2 className="text-base font-bold text-text-primary mb-2">{section.title}</h2>
            <p className="text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
