import type { Metadata } from 'next';
import Link from 'next/link';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

export const metadata: Metadata = {
  title: 'Terms of Service — INSI AI Today',
  description: 'Read the INSI AI Today Terms of Service. These terms govern your use of our AI news platform, including commenting, voting, content usage, and advertising.',
  alternates: { canonical: `${siteUrl}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const lastUpdated = 'June 8, 2026';
  const effectiveDate = 'June 8, 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="badge bg-primary/15 border border-primary/30 text-primary text-xs mb-4 inline-block">Legal</span>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-text-muted text-sm">
          Last updated: {lastUpdated} &nbsp;·&nbsp; Effective date: {effectiveDate}
        </p>
      </div>

      <div className="card p-5 mb-6 bg-primary/5 border-primary/20">
        <p className="text-sm text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Please read these terms carefully.</strong> By accessing or
          using INSI AI Today (insiai.today), you agree to be bound by these Terms of Service. If you do
          not agree with any part of these terms, please stop using the platform immediately. Questions?
          Email us at <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">insiai.today@gmail.com</a>.
        </p>
      </div>

      <div className="space-y-5 text-text-secondary">

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">1. Acceptance of These Terms</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and
              INSI AI Today ("we," "us," "our," or the "Platform"). By visiting, reading, or interacting
              with any content on insiai.today, you acknowledge that you have read, understood, and agree
              to be bound by these Terms and our{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>,
              which is incorporated by reference.
            </p>
            <p>
              These Terms apply to all visitors, readers, commenters, subscribers, and any other users
              of the platform. If you are accessing INSI AI Today on behalf of an organization, you
              represent that you have authority to bind that organization to these Terms.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material
              changes by updating the "Last updated" date at the top of this page and, where appropriate,
              by emailing newsletter subscribers. Your continued use of the platform after any modification
              constitutes acceptance of the revised Terms.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">2. Description of the Platform</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              INSI AI Today is a curated artificial intelligence news aggregator and publishing platform.
              We provide two types of content:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Aggregated news posts:</strong> Stories sourced from third-party publications
                via RSS feeds. These posts summarize or excerpt third-party content and always include
                a direct link to the original source article. The full copyright of the original
                content belongs to the respective publisher.
              </li>
              <li>
                <strong>Original editorial content:</strong> Articles, analysis, and commentary written
                by the INSI AI Today editorial team. These are clearly labeled as "Original Article"
                on the platform. Copyright for this content belongs exclusively to INSI AI Today.
              </li>
            </ul>
            <p>
              The platform also features interactive elements including community voting (upvotes and
              downvotes), user-submitted comments, a newsletter subscription service, a search function,
              and a WhatsApp community group maintained separately from this website.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">3. Intellectual Property & Content Rights</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p><strong className="text-text-primary">3.1 Our original content</strong></p>
            <p>
              All original articles, editorial commentary, design elements, logo, brand name ("INSI AI Today"),
              and tagline ("Where signals become intelligence") are the exclusive intellectual property of
              INSI AI Today and are protected by copyright, trademark, and other applicable laws.
              Unauthorized reproduction, distribution, modification, or commercial use of our original
              content is strictly prohibited without prior written permission.
            </p>
            <p>
              You may share individual URLs to our content on social media and personal websites. You may
              quote brief excerpts (up to 50 words) for commentary or educational purposes, provided you
              include a clear attribution and a link back to the original page on our platform.
            </p>
            <p><strong className="text-text-primary">3.2 Third-party aggregated content</strong></p>
            <p>
              News posts aggregated from external sources are the intellectual property of their respective
              owners. INSI AI Today displays only short excerpts or summaries and always links to the
              original source. We operate under fair use principles for news aggregation. If you are a
              publisher and believe we are aggregating your content in violation of your rights, please
              contact us at <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">insiai.today@gmail.com</a>{' '}
              for prompt removal.
            </p>
            <p><strong className="text-text-primary">3.3 User-submitted content</strong></p>
            <p>
              When you submit a comment on INSI AI Today, you grant us a non-exclusive, worldwide,
              royalty-free, perpetual license to display, format, and moderate that comment on our platform.
              You retain ownership of your comment. We do not claim it as our own. You represent that
              you own the rights to any content you submit and that it does not infringe on any
              third-party rights.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">4. Community Guidelines & Acceptable Use</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              INSI AI Today is a community built around thoughtful discussion of artificial intelligence.
              We want it to be a space where researchers, developers, students, and curious minds can
              engage in good faith. To keep it that way, we prohibit the following:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                <strong>Spam and self-promotion:</strong> Automated comments, repetitive promotional
                messages, or unsolicited commercial solicitations. This includes pasting the same
                comment across multiple posts.
              </li>
              <li>
                <strong>Hate speech and harassment:</strong> Content that attacks, demeans, or
                discriminates against any person or group based on race, ethnicity, religion, gender,
                sexual orientation, disability, national origin, or any other protected characteristic.
                Personal attacks on other commenters or on INSI AI Today staff will result in
                immediate bans.
              </li>
              <li>
                <strong>Misinformation:</strong> Deliberately false or misleading claims presented
                as factual. This is especially serious in the AI domain, where misinformation about
                capabilities or safety can cause real harm. If you are not sure of a fact, frame
                it as a question or opinion.
              </li>
              <li>
                <strong>Illegal content:</strong> Anything that violates applicable law, including
                material that infringes copyright, constitutes defamation, violates privacy, or
                contains illegal content of any kind.
              </li>
              <li>
                <strong>Vote manipulation:</strong> Using bots, scripts, multiple accounts, or
                coordinated campaigns to artificially inflate or deflate vote counts on any post.
                We monitor for this automatically.
              </li>
              <li>
                <strong>Impersonation:</strong> Claiming to be a researcher, company, or public
                figure you are not. Do not impersonate other community members or INSI AI Today staff.
              </li>
              <li>
                <strong>Off-topic content:</strong> Comments completely unrelated to the article
                being discussed. Minor tangents are fine; persistent off-topic posting is not.
              </li>
            </ul>
            <p>
              Violations of these guidelines may result in comment removal, temporary restriction of
              commenting privileges, or permanent banning from interactive features of the platform.
              We make these decisions at our sole discretion. Appeals may be submitted to{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">5. DMCA Takedown Policy</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act
              (DMCA). If you believe content on INSI AI Today infringes your copyright, please submit
              a written DMCA takedown notice containing the following information:
            </p>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>A physical or electronic signature of the copyright owner or authorized agent.</li>
              <li>Identification of the copyrighted work claimed to be infringed.</li>
              <li>Identification of the infringing material, including its URL on our platform.</li>
              <li>Your contact information (name, address, phone number, email).</li>
              <li>A statement that you have a good-faith belief that the use is not authorized.</li>
              <li>A statement, under penalty of perjury, that the information in your notice is accurate.</li>
            </ol>
            <p>
              Send completed DMCA notices to:{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>.
              We aim to process all valid DMCA notices within 5 business days.
            </p>
            <p>
              Counter-notifications: If you believe content was removed in error, you may submit a
              counter-notification to the same address. We will forward it to the original complainant
              and, if no legal action is filed within 10 business days, restore the content.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">6. Newsletter Terms</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              By subscribing to the INSI AI Today newsletter, you agree to receive periodic email
              communications from us. The newsletter may include curated AI news summaries, editorial
              commentary, platform updates, and sponsored content clearly labeled as such.
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>You may unsubscribe at any time using the link in any newsletter email.</li>
              <li>We will process unsubscribe requests within 48 hours.</li>
              <li>We do not share your email address with advertisers.</li>
              <li>Subscribing constitutes consent under the CAN-SPAM Act and GDPR where applicable.</li>
            </ul>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">7. Advertising Terms</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              INSI AI Today displays third-party advertisements through a display advertising network. By using our
              platform, you acknowledge and agree to the following:
            </p>
            <ul className="space-y-2 ml-4 list-disc">
              <li>
                All ads displayed on our platform are clearly labeled as advertisements. We maintain
                a strict separation between editorial content and paid advertising. No story on our
                platform is paid for, sponsored, or influenced by any advertiser unless explicitly
                labeled as "Sponsored Content."
              </li>
              <li>
                We have no control over which specific ads Google displays. Ad content is governed
                by Google&apos;s advertising policies.
              </li>
              <li>
                You agree not to click on advertisements for fraudulent purposes, use tools
                to interfere with the delivery of legitimate ads served on our platform, or engage in any activity designed to generate invalid or fraudulent clicks.
              </li>
              <li>
                For direct advertising inquiries, please contact us at{' '}
                <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                  insiai.today@gmail.com
                </a>.
              </li>
            </ul>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">8. Disclaimers & Accuracy</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              INSI AI Today is provided "as is" and "as available." We make no warranties of any kind,
              express or implied, regarding the accuracy, completeness, reliability, or timeliness of
              any content on the platform.
            </p>
            <p>
              The AI industry moves extremely fast. Information that is accurate at the time of
              publication may become outdated within hours. We do our best to update or correct
              posts when we become aware of errors, but we cannot guarantee that all content is
              current at any given moment.
            </p>
            <p>
              <strong>Aggregated third-party content:</strong> News articles sourced from external publishers
              represent the views and reporting of those publishers, not of INSI AI Today. We are not
              responsible for the accuracy of their original reporting. Always verify important information
              through primary sources.
            </p>
            <p>
              <strong>Not professional advice:</strong> Nothing on INSI AI Today constitutes financial,
              investment, legal, medical, or professional advice of any kind. Do not make important
              personal or business decisions based solely on content you read here. Consult appropriate
              qualified professionals for matters that require expert guidance.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">9. Limitation of Liability</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              To the fullest extent permitted by applicable law, INSI AI Today, its operators, editors,
              contributors, and service providers shall not be liable for any indirect, incidental,
              special, consequential, exemplary, or punitive damages arising from or relating to:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Your use of or inability to use the platform.</li>
              <li>Any content obtained from the platform.</li>
              <li>Unauthorized access to or alteration of your data.</li>
              <li>Decisions made in reliance on information published on the platform.</li>
              <li>Technical failures, outages, or security breaches beyond our reasonable control.</li>
            </ul>
            <p>
              Our total liability to you for all claims arising from use of the platform shall not
              exceed the greater of: (a) the amount you paid us in the last 12 months (which is
              likely zero, as the platform is free), or (b) USD $100.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">10. Links to Third-Party Websites</h2>
          <p className="text-sm leading-relaxed">
            INSI AI Today links extensively to third-party websites, news articles, and research papers.
            These links are provided for your convenience and do not constitute endorsement of the
            linked content or the organizations behind it. We have no control over and accept no
            responsibility for the content, privacy policies, or practices of any external websites.
            Clicking external links is at your own risk, and you are subject to the terms and policies
            of those external sites.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">11. Governing Law & Dispute Resolution</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              These Terms are governed by and construed in accordance with applicable laws, without
              regard to conflict of law principles. For users in the European Union, applicable EU
              consumer protection laws apply in addition to these Terms.
            </p>
            <p>
              We encourage you to contact us first at{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>{' '}
              if you have any dispute regarding the platform. Most issues can be resolved informally
              and quickly without any formal legal process. We take feedback and complaints seriously
              and typically respond within 2 business days.
            </p>
            <p>
              If informal resolution is not possible, disputes shall be resolved through binding
              arbitration or, where arbitration is not permitted by applicable law, through the
              courts of competent jurisdiction. You and we both waive the right to a jury trial
              and to participate in class action lawsuits to the extent permitted by law.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">12. Platform Availability</h2>
          <p className="text-sm leading-relaxed">
            We aim to keep INSI AI Today available 24 hours a day, seven days a week, but we cannot
            guarantee uninterrupted service. We may need to take the platform offline for maintenance,
            security patching, or unforeseen technical issues. We will make reasonable efforts to
            provide advance notice of planned downtime via our newsletter and social channels.
            We are not liable for any loss or inconvenience caused by platform unavailability.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">13. Termination</h2>
          <div className="text-sm space-y-3 leading-relaxed">
            <p>
              We reserve the right, at our sole discretion, to restrict, suspend, or permanently
              terminate access to interactive features of the platform (commenting, voting) for
              any user who violates these Terms or whose behavior we determine to be harmful
              to the community.
            </p>
            <p>
              You may discontinue use of the platform at any time. If you wish to have your data
              deleted, see our Privacy Policy or email{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-base font-bold text-text-primary mb-3">14. Contact</h2>
          <p className="text-sm leading-relaxed mb-3">
            For any questions or concerns about these Terms of Service, please contact us:
          </p>
          <ul className="text-sm space-y-1 ml-4 list-disc">
            <li>
              <strong>Legal inquiries:</strong>{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>
            </li>
            <li>
              <strong>DMCA / copyright:</strong>{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>
            </li>
            <li>
              <strong>Comment moderation:</strong>{' '}
              <a href="mailto:insiai.today@gmail.com" className="text-primary hover:underline">
                insiai.today@gmail.com
              </a>
            </li>
            <li>
              <strong>General contact:</strong>{' '}
              <Link href="/contact" className="text-primary hover:underline">
                insiai.today/contact
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
