import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#3DC42A] px-8 py-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
                Legal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-white/70 text-sm">Last updated: March 11, 2026</p>
          </div>

          {/* Body */}
          <div className="px-8 py-10 space-y-8 text-gray-700 leading-relaxed">
            <Section title="Overview">
              <p>
                This Privacy Policy describes Our policies and procedures on the collection, use and
                disclosure of Your information when You use Checked, and tells You about Your
                privacy rights and how the law protects You.
              </p>
            </Section>

            <Section title="Definitions">
              <dl className="space-y-3">
                {[
                  [
                    'Application',
                    'Refers to Checked, the software program provided by the Company.',
                  ],
                  [
                    'Company',
                    'Referred to as "We", "Us" or "Our" — refers to Checked, based in Nepal.',
                  ],
                  [
                    'Personal Data',
                    'Any information that relates to an identified or identifiable individual.',
                  ],
                  [
                    'Usage Data',
                    'Data collected automatically when using the Service (e.g. IP address, device identifiers).',
                  ],
                  ['You', 'The individual accessing or using the Service.'],
                ].map(([term, def]) => (
                  <div key={term} className="flex gap-3">
                    <dt className="font-semibold text-gray-900 min-w-[120px] shrink-0">{term}</dt>
                    <dd className="text-gray-600 text-sm">{def}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section title="Data We Collect">
              <p className="mb-3">While using Checked, we may collect:</p>
              <ul className="space-y-2">
                {[
                  'Usage Data collected automatically (IP address, device type, OS, browser type)',
                  'Mobile device unique identifiers and diagnostic data',
                  'Time and date of visits, time spent in the app',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3DC42A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="How We Use Your Data">
              <ul className="space-y-2">
                {[
                  'To provide and maintain our Service',
                  'To monitor the usage of our Service',
                  'To contact you regarding updates or security notices',
                  'To analyze usage trends and improve the app',
                  'For business transfers or legal compliance',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3DC42A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Data Retention">
              <p className="text-sm">
                We retain Personal Data only as long as necessary. Usage data and server logs are
                kept for up to <strong>24 months</strong>. When retention periods expire, data is
                securely deleted or anonymized.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p className="text-sm">
                Checked does not address anyone under the age of 16. We do not knowingly collect
                personally identifiable information from children under 16. If you become aware that
                a child has provided us with Personal Data, please contact us immediately.
              </p>
            </Section>

            <Section title="Security">
              <p className="text-sm">
                We strive to use commercially reasonable means to protect your Personal Data.
                However, no method of transmission over the Internet or electronic storage is 100%
                secure and we cannot guarantee its absolute security.
              </p>
            </Section>

            <Section title="Your Rights">
              <p className="text-sm mb-3">You have the right to:</p>
              <ul className="space-y-2">
                {[
                  'Access the Personal Data we hold about you',
                  'Request correction or deletion of your data',
                  'Object to processing of your Personal Data',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3DC42A] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Contact Us">
              <p className="text-sm">
                If you have any questions about this Privacy Policy, visit:{' '}
                <a
                  href="https://checked.kriteshtimsina.com.np"
                  className="text-[#2A8A1E] font-medium hover:underline"
                >
                  checked.kriteshtimsina.com.np
                </a>
              </p>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}
