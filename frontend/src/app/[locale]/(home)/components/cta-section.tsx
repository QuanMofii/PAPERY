"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/registry/new-york-v4/ui/button"
import Link from "next/link"

export function CtaSection() {
  const t = useTranslations('homePage.cta')

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl opacity-90 mb-8">
            {t('subtitle')}
          </p>
          <Link href="/dashboard">
          <Button size="lg" variant="secondary" asChild>
           {t('button')}
          </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

