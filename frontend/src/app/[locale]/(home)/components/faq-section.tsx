"use client"

import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/new-york-v4/ui/accordion"

const faqs = [
  {
    questionKey: "rag.question",
    answerKey: "rag.answer",
  },
  {
    questionKey: "formats.question",
    answerKey: "formats.answer",
  },
  {
    questionKey: "security.question",
    answerKey: "security.answer",
  },
  {
    questionKey: "customize.question",
    answerKey: "customize.answer",
  },
  {
    questionKey: "accuracy.question",
    answerKey: "accuracy.answer",
  },
  {
    questionKey: "integration.question",
    answerKey: "integration.answer",
  },
]

export function FaqSection() {
  const t = useTranslations('homePage.faq')

  return (
    <section id="faq" className="py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{t(faq.questionKey)}</AccordionTrigger>
                <AccordionContent>{t(faq.answerKey)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

