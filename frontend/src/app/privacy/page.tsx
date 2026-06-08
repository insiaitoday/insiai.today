import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

export const metadata: Metadata = {
  title: 'Privacy Policy — INSI AI Today',
  description: 'Read the INSI AI Today Privacy Policy. We explain clearly what data we collect, why we collect it, how long we keep it, and exactly what your rights are.',
  alternates: { canonical: `${siteUrl}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const lastUpdated = 'June 8, 2026';
  const effectiveDate = 'June 8, 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">Legal</span>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm">
          Last updated: {lastUpdated} &nbsp;·&nbsp; Effective date: {effectiveDate}
        </p>
      </div>

      <div className="card p-5 mb-6 bg-primary/5 border-primary/20">
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">The short version:</strong> We collect only what we need to
          operate this website. We do not sell your personal data. We do not share it with anyone except
          the services listed in this policy. You have the right to request deletion of any data we hold.
          For questions, email us at <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">insiai.today@gmail.com</a>.
        </p>
      </div>

      <div className="space-y-5 text-text-secondary">

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">1. Who We Are</h2>
          <p className="text-sm leading-relaxed mb-3">
            INSI AI Today (referred to as "we," "us," or "our") is a digital news publication specializing
            in artificial intelligence coverage. We operate the website available at insiai.today and
            maintain a community group on WhatsApp. Our contact email for all privacy matters is{' '}
            <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">insiai.today@gmail.com</a>.
          </p>
          <p className="text-sm leading-relaxed">
            This Privacy Policy explains how we collect, use, store, and share information about you when
            you use our website or interact with our services. By using INSI AI Today, you agree to the
            collection and use of information as described in this policy. If you disagree with anything
            here, please stop using our services and contact us to request data deletion.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">2. Information We Collect</h2>
          <p className="text-sm leading-relaxed mb-3">
            We believe in collecting the minimum information necessary. Here is a precise breakdown of
            what we do and do not collect:
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-text-primary mb-1">2.1 Information you give us directly</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>
                  <strong>Comments:</strong> When you post a comment on any article, we ask for your name
                  and email address. Your name appears publicly next to your comment. Your email address
                  is never displayed publicly — we use it only for internal moderation purposes and to
                  notify you of replies if you opt in.
                </li>
                <li>
                  <strong>Newsletter subscriptions:</strong> If you subscribe to our newsletter, we collect
                  your email address. You may also optionally specify how frequently you want emails
                  (daily or weekly).
                </li>
                <li>
                  <strong>Contact form submissions:</strong> When you use our Contact page, we collect your
                  name, email address, and the content of your message. We use this solely to respond to
                  your inquiry.
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-text-primary mb-1">2.2 Information collected automatically</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>
                  <strong>IP addresses:</strong> Our server logs record your IP address when you visit
                  the site. We use this for rate limiting (to prevent abuse), spam prevention on
                  comments, and basic security monitoring. We do not use IP addresses for
                  advertising targeting.
                </li>
                <li>
                  <strong>Vote preferences:</strong> When you upvote or downvote a post, we store an
                  anonymous session identifier in your browser&apos;s localStorage to prevent
                  duplicate votes. This session ID does not identify you personally and is not
                  shared with any third party.
                </li>
                <li>
                  <strong>View counts:</strong> We track page view counts per article using a session
                  identifier. This helps us surface trending content. Again, this is anonymous and
                  not linked to any personal profile.
                </li>
                <li>
                  <strong>Analytics data:</strong> We may use Google Analytics to understand how visitors
                  navigate our site (which pages they visit, how long they spend, what devices
                  they use). This data is aggregated and anonymized by Google before we see it.
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-text-primary mb-1">2.3 What we do NOT collect</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>We do not collect full names unless you provide them voluntarily in a comment or form.</li>
                <li>We do not collect phone numbers.</li>
                <li>We do not collect payment information — all services are free.</li>
                <li>We do not collect social media account details.</li>
                <li>We do not build individual user profiles or track you across the internet.</li>
                <li>We do not require account registration to use any feature of the site.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">3. How We Use Your Information</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>We use the information we collect for the following specific purposes, and no others:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>To display your comments:</strong> Your name and comment content appear on the site
                next to the post you commented on. Your email is never shown publicly.
              </li>
              <li>
                <strong>To send newsletters:</strong> If you subscribed, we send you email digests
                at the frequency you chose (daily or weekly). Every email includes an unsubscribe
                link. We will not email you without your explicit consent.
              </li>
              <li>
                <strong>To respond to contact inquiries:</strong> We read every message submitted through
                our Contact form and reply as promptly as we can. We do not store these messages
                beyond what is needed to handle the inquiry.
              </li>
              <li>
                <strong>To prevent abuse:</strong> IP addresses help us identify and block spam,
                bot attacks, and rate-limit abusive behavior like vote manipulation.
              </li>
              <li>
                <strong>To improve our editorial content:</strong> Aggregated analytics data helps us
                understand which topics resonate with our audience, what times people read most,
                and what devices they use — informing decisions about our coverage.
              </li>
              <li>
                <strong>To serve relevant advertising:</strong> We display ads through a third-party
                display advertising network. Ad partners may use cookies and your browsing behavior to serve
                relevant ads. See Section 6 for full advertising disclosure.
              </li>
            </ul>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">4. Cookies</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              We use cookies and similar local storage technologies on INSI AI Today. Here is exactly
              what we use and why:
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-text-primary">Essential cookies (cannot be disabled)</p>
                <p className="mt-1">
                  These are necessary for the site to function. They include session identifiers used
                  to remember your vote preferences within a browsing session, and security tokens
                  to prevent cross-site request forgery. Without these, key features like voting
                  and comment submission would not work.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">Analytics cookies (optional)</p>
                <p className="mt-1">
                  Google Analytics may set cookies to help us understand site traffic patterns.
                  These collect anonymized, aggregate data about visitor behavior. You can
                  opt out at any time by visiting{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Analytics Opt-out
                  </a>.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">Advertising cookies (third-party)</p>
                <p className="mt-1">
                  Our advertising partners may set cookies to serve relevant advertising based on your
                  interests and general browsing context. You can opt out of personalized ads at{' '}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Google Ad Settings
                  </a>.
                </p>
              </div>
            </div>
            <p>
              To disable cookies entirely, you can adjust your browser settings. Note that disabling
              all cookies may affect the functionality of voting and comments on our site.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">5. Third-Party Services</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              We use a small set of trusted third-party services to operate INSI AI Today. Each of these
              services has their own privacy policy which governs their data handling:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs mt-2">
                <thead>
                  <tr className="bg-background-elevated">
                    <th className="text-left p-2 font-semibold">Service</th>
                    <th className="text-left p-2 font-semibold">Purpose</th>
                    <th className="text-left p-2 font-semibold">Data Shared</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Supabase', 'Database & file storage', 'Comments, newsletter emails, post data'],
                    ['Vercel', 'Web hosting & CDN', 'Server logs, IP addresses'],
                    ['Google Analytics', 'Traffic analytics', 'Anonymized page visit data'],
                    ['Resend', 'Transactional email delivery', 'Newsletter subscriber emails'],
                  ].map(([service, purpose, data]) => (
                    <tr key={service} className="border-t border-border">
                      <td className="p-2 font-medium">{service}</td>
                      <td className="p-2 text-text-muted">{purpose}</td>
                      <td className="p-2 text-text-muted">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              We do not sell your data to any of these providers beyond what is necessary for them
              to perform the service. External links on our site take you to third-party websites —
              we are not responsible for their privacy practices.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">6. Advertising Disclosure</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              INSI AI Today is supported by advertising. We display ads through a{' '}
              <strong>third-party display advertising network</strong>.
              Here is what that means in practice:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                Ads on our site are served by Google automatically. We do not personally select which
                ads appear — Google&apos;s algorithms match ads to our content and your interests.
              </li>
              <li>
                All advertisements on INSI AI Today are clearly labeled with an "Advertisement" label
                or are displayed in clearly delineated ad units. We never mix paid content with our
                editorial content without disclosure.
              </li>
              <li>
                We are not responsible for the content, accuracy, or claims of third-party advertisements.
                Clicking on an ad takes you to the advertiser&apos;s own website, governed by their
                own terms and policies.
              </li>
              <li>
                Google may use your browsing history and cookie data to serve personalized ads.
                You can control this through{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google&apos;s Ad Settings
                </a>{' '}
                or opt out entirely via the{' '}
                <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  NAI opt-out page
                </a>.
              </li>
            </ul>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">7. Data Retention</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>We keep data only as long as it serves the purpose for which it was collected:</p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Comments:</strong> Retained for as long as the associated post is live.
                If a post is deleted, its comments are deleted automatically. You may request
                deletion of your specific comment at any time.
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> Your email is retained until you
                unsubscribe. Every newsletter email includes a one-click unsubscribe link.
                Upon unsubscription, your email is deleted within 30 days.
              </li>
              <li>
                <strong>Contact form messages:</strong> Retained for 90 days after the inquiry
                is resolved, then permanently deleted.
              </li>
              <li>
                <strong>Server logs (IP addresses):</strong> Retained for 30 days for security
                and abuse prevention, then automatically purged.
              </li>
              <li>
                <strong>Analytics data:</strong> Google Analytics data is retained for 14 months
                under our current configuration, then automatically expired by Google.
              </li>
            </ul>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">8. Your Rights</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              You have clear rights over your personal data, regardless of where you are in the world.
              We respect and honor these rights:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Right of access:</strong> You may request a copy of any personal data we hold
                about you. We will provide this within 30 days of your request.
              </li>
              <li>
                <strong>Right to rectification:</strong> If any data we hold is incorrect, you have
                the right to request we correct it immediately.
              </li>
              <li>
                <strong>Right to erasure ("right to be forgotten"):</strong> You may request we
                permanently delete all personal data we hold about you. We will process this
                within 30 days unless we are legally required to retain certain data.
              </li>
              <li>
                <strong>Right to restrict processing:</strong> You may ask us to stop processing
                your data while we handle a dispute or correction request.
              </li>
              <li>
                <strong>Right to data portability:</strong> You may request your data in a
                machine-readable format (JSON or CSV).
              </li>
              <li>
                <strong>Right to object:</strong> You may object to our processing of your data
                for analytics or advertising purposes at any time.
              </li>
              <li>
                <strong>CCPA rights (California residents):</strong> California residents have
                additional rights under the California Consumer Privacy Act, including the right
                to know categories of personal information collected, the right to delete, and
                the right to opt out of sale (note: we do not sell personal data).
              </li>
              <li>
                <strong>GDPR rights (EU/EEA residents):</strong> Residents of the European Union
                and European Economic Area have the rights described above under the General Data
                Protection Regulation. You also have the right to lodge a complaint with your
                local data protection authority.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>{' '}
              with the subject line "Privacy Rights Request." We will confirm receipt within 48 hours
              and fulfill your request within 30 days.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">9. Children&apos;s Privacy</h2>
          <p className="text-sm leading-relaxed">
            INSI AI Today is not directed at children under 13 years of age, and we do not knowingly
            collect personal information from anyone under 13. If you are a parent or guardian and
            believe your child has submitted personal data to us, please contact us immediately at{' '}
            <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
              insiai.today@gmail.com
            </a>{' '}
            and we will delete the information promptly.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">10. Security</h2>
          <p className="text-sm leading-relaxed mb-3">
            We take reasonable and appropriate technical measures to protect the personal information
            we hold. These include:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc leading-relaxed">
            <li>HTTPS encryption on all pages of our website.</li>
            <li>Row-level security policies on our Supabase database ensuring data isolation.</li>
            <li>Service-role keys stored only on the server, never exposed to the browser.</li>
            <li>Regular review of third-party service permissions and access levels.</li>
          </ul>
          <p className="text-sm mt-3 leading-relaxed">
            No method of electronic transmission or storage is 100% secure. While we do everything
            reasonable to protect your data, we cannot guarantee absolute security. If you discover
            a security vulnerability in our systems, please disclose it responsibly by emailing{' '}
            <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
              insiai.today@gmail.com
            </a>.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">11. Changes to This Policy</h2>
          <p className="text-sm leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, or legal requirements. When we do, we will update the "Last updated" date
            at the top of this page. For significant changes, we will notify newsletter subscribers
            by email. We encourage you to review this page periodically. Your continued use of
            INSI AI Today after any changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">12. Contact Us</h2>
          <p className="text-sm leading-relaxed mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or how
            we handle your data, please reach out through any of the following channels:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>
            </li>
            <li>
              <strong>Contact form:</strong>{' '}
              <Link href="/contact" className="text-primary hover:underline">
                insiai.today/contact
              </Link>
            </li>
          </ul>
          <p className="text-sm mt-3 leading-relaxed">
            We aim to respond to all privacy inquiries within 48 hours on business days.
          </p>
        </div>

      </div>
    </div>
  );
}
