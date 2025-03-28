"use client"

import { useTranslations } from "next-intl"
import { Upload, Database, MessageSquare, Search } from "lucide-react"

const steps = [
  {
    icon: Upload,
    titleKey: "upload.title",
    descriptionKey: "upload.description",
  },
  {
    icon: Database,
    titleKey: "process.title",
    descriptionKey: "process.description",
  },
  {
    icon: Search,
    titleKey: "ask.title",
    descriptionKey: "ask.description",
  },
  {
    icon: MessageSquare,
    titleKey: "answer.title",
    descriptionKey: "answer.description",
  },
]

export function HowItWorksSection() {
  const t = useTranslations('homePage.howItWorks')

  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-border hidden md:block b" />

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`md:flex items-center gap-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <div
                      className={`bg-card rounded-lg p-8 shadow-sm border border-border relative ${
                        index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">{t(step.titleKey)}</h3>
                      <p className="text-muted-foreground">{t(step.descriptionKey)}</p>
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <div className="md:w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

