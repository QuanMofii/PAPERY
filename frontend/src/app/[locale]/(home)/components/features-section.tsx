"use client"

import { useTranslations } from "next-intl"
import { Brain, FileSearch, Lock, Zap, BarChart, Globe } from "lucide-react"

const features = [
  {
    icon: Brain,
    titleKey: "rag.title",
    descriptionKey: "rag.description",
  },
  {
    icon: FileSearch,
    titleKey: "multiDoc.title",
    descriptionKey: "multiDoc.description",
  },
  {
    icon: Lock,
    titleKey: "security.title",
    descriptionKey: "security.description",
  },
  {
    icon: Zap,
    titleKey: "realtime.title",
    descriptionKey: "realtime.description",
  },
  {
    icon: BarChart,
    titleKey: "analytics.title",
    descriptionKey: "analytics.description",
  },
  {
    icon: Globe,
    titleKey: "multilingual.title",
    descriptionKey: "multilingual.description",
  },
]

export function FeaturesSection() {
  const t = useTranslations('homePage.features')

  return (
    <section id="features" className="py-20 bg-muted/50 ">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">{t(feature.titleKey)}</h3>
              <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

