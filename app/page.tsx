export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between max-w-2xl mx-auto px-6 py-16 sm:py-24">
      <div className="space-y-14 sm:space-y-16">
        {/* Status / Studio Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground w-fit">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Independent Studio · Munich</span>
        </div>

        {/* Hero */}
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Active AI Tools
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Independent studio by David G, building tools for short-form content
            creators and writing about creator marketing.
          </p>
        </section>

        {/* About */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            About
          </h2>
          <div className="text-base text-foreground/90 leading-relaxed space-y-3">
            <p>
              I&apos;m a solo founder based in Munich, building software and digital
              products since I was 18. Before starting Creafico, I worked with 40+
              freelance design and video clients, getting deep into the mechanics of
              what makes content perform. Today, I focus full-time on building
              focused intelligence tools to help creators understand their audience
              and outpace competition.
            </p>
          </div>
        </section>

        {/* What I'm building */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What I&apos;m building
          </h2>

          <div className="group relative rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Creafico
                  </h3>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    iOS App
                  </span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                  An iOS app that shows creators which videos are going viral among
                  their competitors, giving them data-backed inspiration for their
                  next post.
                </p>
              </div>

              <div className="pt-1 sm:pt-0 shrink-0">
                <a
                  href="https://creafico.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  <span>Visit Creafico</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </h2>
          <p className="text-base text-muted-foreground">
            If you received an outreach email or want to get in touch, reach me directly at:
          </p>
          <div className="pt-1">
            <a
              href="mailto:david@activeaitools.com"
              className="inline-flex items-center gap-2 text-base font-medium text-foreground hover:text-accent transition-colors underline decoration-border hover:decoration-current underline-offset-4"
            >
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span>david@activeaitools.com</span>
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 David G</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.creafico.com/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Impressum
          </a>
          <span>·</span>
          <a
            href="https://www.creafico.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Datenschutz
          </a>
        </div>
      </footer>
    </main>
  )
}
