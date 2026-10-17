import { Link } from 'react-router-dom'

const privacyEmail = 'support@rallypointgensan.com'

const sections = [
  {
    title: 'Who we are',
    content: (
      <p>
        Rally Point Gensan is the club and app name used in this notice. The legal registered
        entity operating the service has not yet been confirmed here. This notice explains how
        information is handled when you use the Rally Point app and services.
      </p>
    ),
  },
  {
    title: 'Personal information we collect',
    content: (
      <>
        <p>Depending on how you use the app, we may collect:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Account details such as your name, email address, and optional phone number.</li>
          <li>Membership, booking, open-play, check-in, and support inquiry details.</li>
          <li>Payment and transaction records related to club services.</li>
        </ul>
        <p className="mt-2">
          Do not send sensitive personal information unless it is needed for a specific service
          and we explain why it is required.
        </p>
      </>
    ),
  },
  {
    title: 'Why we use information and lawful bases',
    content: (
      <>
        <p>
          We use information to create and manage accounts, provide memberships and bookings,
          support check-in and transactions, respond to questions, maintain the service, and
          meet legal requirements.
        </p>
        <p className="mt-2">
          Under the Philippine Data Privacy Act of 2012 (RA 10173), processing is based, as
          applicable, on your consent, steps you request before or to perform a service
          agreement, compliance with a legal obligation, or a legitimate interest that does
          not override your rights. If sensitive personal information is processed, we will
          rely on a basis permitted by the Act.
        </p>
      </>
    ),
  },
  {
    title: 'Sharing and service providers',
    content: (
      <p>
        We may share information with service providers that help operate the app, including
        Supabase for account and database services. The current payment journey uses simulated
        flows and is not a completed live payment integration. If a payment provider is
        connected, this notice should be updated with its name and the information shared.
        Information may also be disclosed when required by law. This is not a complete
        provider list; details may be updated as services are confirmed.
      </p>
    ),
  },
  {
    title: 'Retention and security',
    content: (
      <>
        <p>
          We keep personal information only for as long as needed for the purposes above and
          applicable legal or operational requirements. A specific retention schedule has not
          yet been set out in this notice.
        </p>
        <p className="mt-2">
          We aim to use reasonable organizational, physical, and technical safeguards to
          protect information from unauthorized access, use, or disclosure. No method of
          storage or transmission can be guaranteed completely secure. Demo-mode information
          is stored in your browser and is separate from live club records.
        </p>
      </>
    ),
  },
  {
    title: 'Your rights under RA 10173',
    content: (
      <>
        <p>Subject to legal conditions and exceptions, you may have the right to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Be informed about how your personal information is processed and access it.</li>
          <li>Object to processing, or request correction, erasure, or blocking.</li>
          <li>Request data portability where applicable.</li>
          <li>File a complaint with the National Privacy Commission and seek remedies provided by law.</li>
        </ul>
        <p className="mt-2">
          You may also withdraw consent where processing is based on consent. This does not
          affect processing already carried out lawfully.
        </p>
      </>
    ),
  },
  {
    title: 'Privacy contact',
    content: (
      <p>
        For a privacy question or request, email{' '}
        <a
          className="inline-flex min-h-12 items-center font-semibold text-brand-800 underline"
          href={`mailto:${privacyEmail}`}
        >
          {privacyEmail}
        </a>
        . This is a temporary support contact and has not been confirmed as a dedicated
        Data Protection Officer contact.
      </p>
    ),
  },
]

export function PrivacyNoticePage() {
  return (
    <div className="app-shell app-shell-desktop">
      <main className="app-content-rail safe-bottom mx-auto w-full py-6 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            className="inline-flex min-h-12 items-center font-semibold text-brand-800 underline underline-offset-2"
            to="/login"
          >
            Back to login
          </Link>
          <header className="mt-4 border-b border-slate-200 pb-5">
            <h1 className="text-heading-1 font-extrabold tracking-tight text-slate-950">
              Privacy Notice
            </h1>
            <p className="mt-2 text-body text-slate-600">
              For Rally Point Gensan app users
            </p>
            <p className="mt-1 text-caption text-slate-500">
              Last updated: October 17, 2026
            </p>
          </header>

          <div className="mt-5 space-y-4">
            {sections.map(({ title, content }) => (
              <section
                key={title}
                aria-labelledby={`privacy-${title.toLowerCase().replaceAll(' ', '-')}`}
                className="card p-4 sm:p-5"
              >
                <h2
                  id={`privacy-${title.toLowerCase().replaceAll(' ', '-')}`}
                  className="text-title font-bold text-slate-900"
                >
                  {title}
                </h2>
                <div className="mt-2 text-body leading-relaxed text-slate-700">{content}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
