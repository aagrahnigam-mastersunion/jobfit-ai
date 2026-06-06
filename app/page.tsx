import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
            work_history
          </span>
          <span className="font-bold text-lg text-primary" style={{ fontFamily: 'Source Sans 3' }}>
            JobFit AI
          </span>
        </Link>
        <Link href="/auth/signin">
          <button
            className="border border-outline text-on-surface rounded-full px-5 py-2 text-sm font-medium hover:bg-surface-container transition-colors"
            style={{ fontFamily: 'Roboto Flex' }}
          >
            Sign In
          </button>
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant text-xs text-on-surface-variant mb-6">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          Powered by Llama 3.3 70B on Groq
        </div>

        <h1
          className="text-on-surface mb-6"
          style={{
            fontFamily: 'Source Sans 3',
            fontSize: 'clamp(36px, 8vw, 57px)',
            lineHeight: 1.1,
            letterSpacing: '-0.25px',
            fontWeight: 400,
          }}
        >
          Know your{' '}
          <span className="text-primary">exact fit</span>
          {' '}before you apply
        </h1>

        <p className="text-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
          Upload your CV once. Paste any job description. Get a detailed AI analysis — match
          confidence, gap taxonomy, and actionable fixes — in under 30 seconds.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/auth/signin">
            <button
              className="bg-primary text-white rounded-full px-7 py-3.5 text-base font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                fontFamily: 'Roboto Flex',
                boxShadow: '0 4px 8px rgba(24,60,230,0.28), 0 2px 4px rgba(24,60,230,0.16)',
              }}
            >
              Get started free
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </Link>
          <Link href="/dashboard">
            <button
              className="border border-outline text-on-surface rounded-full px-7 py-3.5 text-base font-medium hover:bg-surface-container transition-colors"
              style={{ fontFamily: 'Roboto Flex' }}
            >
              Go to dashboard
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-on-surface-variant">
          {['Match confidence in <5s', 'No raw CV stored', 'Reuse your profile forever'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-tertiary"
                style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-outline-variant bg-surface-container-low py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center text-on-surface mb-12"
            style={{ fontFamily: 'Source Sans 3', fontSize: '32px', lineHeight: '40px' }}
          >
            Everything you need to land the right role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: 'bolt',
                title: 'Instant Confidence Score',
                description:
                  'Get a HIGH / MEDIUM / LOW match rating in under 5 seconds, backed by specific evidence from both your CV and the JD.',
              },
              {
                icon: 'analytics',
                title: 'Gap Taxonomy',
                description:
                  'Every gap is classified by failure mode — ATS keyword, experience framing, seniority mismatch — so you know exactly what to fix.',
              },
              {
                icon: 'security',
                title: 'Privacy First',
                description:
                  'Your raw CV is never stored. We extract a structured skill vector once and discard the original — analyse as many JDs as you want.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-elevated-surface-1 p-6 space-y-3"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                  >
                    {feature.icon}
                  </span>
                </div>
                <h3
                  className="font-medium text-on-surface"
                  style={{ fontFamily: 'Source Sans 3', fontSize: '16px' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-on-surface mb-4"
            style={{ fontFamily: 'Source Sans 3', fontSize: '32px', lineHeight: '40px' }}
          >
            Ready to stop guessing?
          </h2>
          <p className="text-on-surface-variant mb-8">
            Sign in with your email — no credit card required.
          </p>
          <Link href="/auth/signin">
            <button
              className="bg-primary text-white rounded-full px-7 py-3.5 text-base font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                fontFamily: 'Roboto Flex',
                boxShadow: '0 4px 8px rgba(24,60,230,0.28), 0 2px 4px rgba(24,60,230,0.16)',
              }}
            >
              Start analysing for free
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-outline-variant py-6 px-4 text-center text-xs text-on-surface-variant">
        © {new Date().getFullYear()} JobFit AI. Built with Next.js and Groq.
      </footer>
    </div>
  )
}
