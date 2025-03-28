"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { toast } from "sonner"

export function NewsletterSection() {
  const t = useTranslations('homePage.newsletter')
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success(t('toast.success'), {
      description: t('toast.description'),
      duration: 2000
    })

    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground mb-6">
            {t('subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder={t('form.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('form.subscribing') : t('form.subscribe')}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">{t('form.privacy')}</p>
        </div>
      </div>
    </section>
  )
}

