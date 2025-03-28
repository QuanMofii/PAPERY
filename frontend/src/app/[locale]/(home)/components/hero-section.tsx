"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/registry/new-york-v4/ui/button"
import Link from "next/link"

export function HeroSection() {
  const t = useTranslations('homePage.hero')

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/dashboard">
              <Button size="lg" asChild>
               {t('cta.getStarted')}
              </Button>
              </Link>
              <Link href="#how-it-works">
              <Button size="lg" variant="outline" asChild>
                {t('cta.learnMore')}
              </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-card rounded-lg shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-12 bg-muted flex items-center px-4 gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs font-medium ml-2">{t('chatbot.title')}</div>
              </div>

              <div className="pt-12 p-6 max-h-[500px] overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      AI
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <p>{t('chatbot.greeting')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                      U
                    </div>
                    <div className="flex-1 bg-primary/10 p-4 rounded-lg">
                      <p>{t('chatbot.question')}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      AI
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <p>{t('chatbot.response.intro')}</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>{t('chatbot.response.point1')}</li>
                        <li>{t('chatbot.response.point2')}</li>
                        <li>{t('chatbot.response.point3')}</li>
                        <li>{t('chatbot.response.point4')}</li>
                        <li>{t('chatbot.response.point5')}</li>
                      </ul>
                      <p className="mt-2">{t('chatbot.response.followUp')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 -z-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

