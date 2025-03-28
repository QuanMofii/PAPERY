"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york-v4/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  const t = useTranslations('homePage.header')
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container  flex h-16 items-center justify-between ">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Papery</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 mx-auto">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.features')}
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.howItWorks')}
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.pricing')}
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              {t('nav.faq')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('nav.toggleMenu')} className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('nav.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{t('nav.menu')}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-6 container">
                <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('nav.features')}
                </Link>
                <Link href="#how-it-works" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('nav.howItWorks')}
                </Link>
                <Link href="#pricing" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('nav.pricing')}
                </Link>
                <Link href="#faq" className="text-lg font-medium hover:text-primary transition-colors">
                  {t('nav.faq')}
                </Link>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">{t('cta.getStarted')}</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Link href="/dashboard">
          <Button asChild className="hidden md:flex">
            {t('cta.getStarted')}
          </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

