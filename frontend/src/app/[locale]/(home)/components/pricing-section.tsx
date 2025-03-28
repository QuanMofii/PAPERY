"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    nameKey: "starter.name",
    price: "$9",
    descriptionKey: "starter.description",
    featuresKey: "starter.features",
    cta: "getStarted",
    popular: true,
  },
  {
    nameKey: "professional.name",
    price: "$19",
    descriptionKey: "professional.description",
    featuresKey: "professional.features",
    cta: "getStarted",
    popular: false,
  },
  {
    nameKey: "enterprise.name",
    price: "Custom",
    descriptionKey: "enterprise.description",
    featuresKey: "enterprise.features",
    cta: "contactSales",
    popular: false,
  },
]

export function PricingSection() {
  const t = useTranslations('homePage.pricing')

  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-lg overflow-hidden border ${
                plan.popular ? "border-primary shadow-lg relative" : "border-border shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-medium">
                  {t('popular')}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-medium mb-2">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground ml-2">/month</span>}
                </div>
                <p className="text-muted-foreground mb-6">{t(plan.descriptionKey)}</p>

                <Link href="/dashboard">
                <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"} asChild>
                 {t(`cta.${plan.cta}`)}
                </Button>
                </Link>

                <ul className="space-y-3">
                  {t.raw(plan.featuresKey).map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

