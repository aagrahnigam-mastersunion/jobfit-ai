import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Zap, Shield, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs text-muted-foreground mb-6">
          <Zap className="h-3 w-3 text-primary" />
          Powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Know your{' '}
          <span className="text-primary">exact fit</span>
          {' '}before you apply
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Upload your CV once. Paste any job description. Get a detailed AI analysis — match confidence,
          gap taxonomy, and actionable fixes — in under 30 seconds.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/auth/signin">
            <Button size="lg" className="gap-2">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Go to dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm text-muted-foreground">
          {[
            'Match confidence in <5s',
            'No raw CV stored',
            'Reuse your profile forever',
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Everything you need to land the right role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Instant Confidence Score',
                description:
                  'Get a HIGH / MEDIUM / LOW match rating in under 5 seconds, backed by specific evidence from both your CV and the JD.',
              },
              {
                icon: BarChart3,
                title: 'Gap Taxonomy',
                description:
                  'Every gap is classified by failure mode — ATS keyword, experience framing, seniority mismatch — so you know exactly what to fix.',
              },
              {
                icon: Shield,
                title: 'Privacy First',
                description:
                  'Your raw CV is never stored. We extract a structured skill vector once and discard the original — analyse as many JDs as you want.',
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-xl border bg-background p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to stop guessing?</h2>
          <p className="text-muted-foreground mb-8">
            Sign in with Google or your email — no credit card required.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="gap-2">
              Start analysing for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} JobFit AI. Built with Next.js and Gemini.
      </footer>
    </div>
  )
}
