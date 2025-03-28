"use client"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/registry/new-york-v4/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/new-york-v4/ui/dropdown-menu"
import { Palette } from "lucide-react"
import { themes } from "@/lib/themes"
import { useRouter } from "next/navigation"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change theme">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.name}
            onClick={() => handleThemeChange(t.name)}
            className={theme === t.name ? "bg-accent text-accent-foreground" : ""}
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: t.primary }} />
              {t.label}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



