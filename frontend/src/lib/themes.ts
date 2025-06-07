export type Theme = {
  name: string
  label: string
  primary: string
}

export const themes: Theme[] = [
  {
    name: "light",
    label: "Light",
    primary: "oklch(0.985 0 0)",
  },
  {
    name: "dark",
    label: "Dark",
    primary: "oklch(0.205 0 0)",
  },
  {
    name: "orange",
    label: "Orange Terracotta",
    primary: "oklch(0.7 0.2 20)",
  },
  {
    name: "blue",
    label: "Ocean Blue",
    primary: "oklch(0.7 0.2 210)",
  },
  {
    name: "green",
    label: "Forest Green",
    primary: "oklch(0.6 0.15 150)",
  },
  {
    name: "purple",
    label: "Royal Purple",
    primary: "oklch(0.7 0.15 270)",
  },
]

