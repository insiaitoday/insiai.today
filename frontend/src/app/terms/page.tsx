import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — LeviAI Today',
  description: 'Terms of Service for LeviAI Today.',
};

export default function TermsPage() {
  const date = 'April 10, 2025';
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-text-muted text-sm mb-8">Last updated: {date}</p>

      <div className="space-y-6 text-text-secondary">
        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By using LeviAI Today, you agree to these terms. If you do not agree, please stop using the platform. We reserve the right to update these terms at any time; continued use constitutes acceptance.',
          },
          {
            title: '2. Content & Copyright',
            content: `LeviAI Today aggregates and links to news from third-party sources. All original source content belongs to the respective publishers. We display only brief excerpts and always link to the original article. Original articles written by LeviAI Today staff are our intellectual property. Do not reproduce our original content without permission.`,
          },
          {
            title: '3. User Comments',
            content: `When you post a comment, you grant us a non-exclusive license to display it on our platform. You are responsible for the content of your comments. You agree not to post: spam, hate speech, illegal content, personal attacks, misinformation, or commercial solicitations. We reserve the right to remove comments and ban users who violate these rules.`,
          },
          {
            title: '4. No Warranties',
            content: `LeviAI Today is provided "as is" without warranties of any kind. We do not guarantee the accuracy of aggregated news content — all external articles are the responsibility of their original publishers. We are not liable for any decisions made based on content published on our platform.`,
          },
          {
            title: '5. Advertising',
            content: `We display third-party advertisements via Google AdSense. We are not responsible for the content of advertisements. Clicking on ads may take you to third-party websites governed by their own terms.`,
          },
          {
            title: '6. Limitation of Liability',
            content: `To the maximum extent permitted by law, LeviAI Today shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.`,
          },
          {
            title: '7. Governing Law',
            content: `These terms are governed by applicable law. Any disputes will be resolved through binding arbitration or small claims court.',`,
          },
          {
            title: '8. Contact',
            content: `Questions about these terms? Contact us at legal@leviai.today.`,
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
