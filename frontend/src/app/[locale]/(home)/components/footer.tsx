"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Github, Linkedin, Facebook } from "lucide-react"

export function Footer() {
  const t = useTranslations('homePage.footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Papery</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">{t('product.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('product.features')}
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('product.howItWorks')}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('product.pricing')}
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('product.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">{t('company.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('company.about')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('company.blog')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('company.careers')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('company.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">{t('legal.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('legal.terms')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('legal.cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {t('copyright', { year: currentYear })}
          </p>

          <div className="flex items-center gap-4 ">
            <Link href="https://www.facebook.com/profile.php?id=61569125321759" className="text-muted-foreground transition-all duration-300 hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">{t('social.facebook')}</span>
            </Link>
            <Link href="https://github.com/Toricat" className="text-muted-foreground transition-all duration-300 hover:text-primary">
              <Github className="h-5 w-5" />
              <span className="sr-only">{t('social.github')}</span>
            </Link>
            <Link href="https://www.linkedin.com/in/ha-minh-quan-b10717294/" className="text-muted-foreground transition-all duration-300 hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">{t('social.linkedin')}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

