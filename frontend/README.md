# Next.js 15 Starter (shadcn) [[LIVE DEMO](...)]

Welcome to the **Next.js 15 Ultimate Starter** repository! This starter frontend is built with Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, Shadcn UI, Authenticate API manual and comes packed with several powerful tools and configurations to accelerate your project setup and streamline development workflows using VS Code.

![Next.js 15 Starter Shadcn](public/images/screenshot1.png)

![Next.js 15 Starter Shadcn](public/images/screenshot2.png)

## 🚀 What's Included

- **Next.js 15**
- **React 19**
- **TypeScript 5**
- **ESLint 9**
- **Prettier 3**
- **Tailwind CSS 4**
- **Shadcn UI**
- **Zod**
- **App Directory**
- **Authenticate API & page**
- **Dashboard Admin**
- **System, Light & Dark Mode**
- **Next.js Bundle Analyzer**
- **Dockerfile** with Node.js 22.14.0 (Alpine)

### 🛠️ ESLint Plugins

- [**@eslint/js**](https://www.npmjs.com/package/@eslint/js)
- [**typescript-eslint**](https://github.com/typescript-eslint/typescript-eslint)
- [**eslint-plugin-react**](https://github.com/jsx-eslint/eslint-plugin-react)
- [**@next/eslint-plugin-next**](https://github.com/vercel/next.js)
- [**eslint-config-prettier**](eslint-config-prettier)
- [**eslint-plugin-tailwindcss**](https://github.com/francoismassart/eslint-plugin-tailwindcss)
- [**eslint-plugin-import**](https://github.com/import-js/eslint-plugin-import)
- [**eslint-plugin-promise**](https://github.com/eslint-community/eslint-plugin-promise)

### ✨ Prettier Plugins

- [**@trivago/prettier-plugin-sort-imports**](https://github.com/trivago/prettier-plugin-sort-imports)
- [**prettier-plugin-tailwindcss**](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

### 💻 VS Code Extensions (Recommended)

To enhance development experience, install the following VS Code extensions:

- [**Auto Close Tag**](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)
- [**Better Comments**](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [**DotENV**](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
- [**EditorConfig for VS Code**](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [**ESLint**](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [**formate: CSS/LESS/SCSS formatter**](https://marketplace.visualstudio.com/items?itemName=MikeBovenlander.formate)
- [**Git History**](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)
- [**Import Cost**](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [**JavaScript Booster**](https://marketplace.visualstudio.com/items?itemName=sburg.vscode-javascript-booster)
- [**npm Intellisense**](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [**Prettier - Code formatter**](https://marketplace.visualstudio.com/items?itemName=esbenp)
- [**Todo Tree**](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)
- [**Turbo Console Log**](https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log)
- [**Package Json Upgrade**](https://marketplace.visualstudio.com/items?itemName=codeandstuff.package-json-upgrade)
- [**Visual Studio Code Commitizen Support**](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen)
- [**Markdown All in One**](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)


## 🏁 Getting Started

### Prerequisites

- **Node.js**: Version 20.18.0 or higher
- **Docker**: For containerized deployment (optional but recommended)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/nextjs-15-starter-shadcn.git
    cd nextjs-15-starter-shadcn
    ```
    To get the code without example change branch to without-example
    ```bash
    git checkout without-example
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    # or with Yarn
    yarn install
    ```

3. **Run Development Server**:
    ```bash
    npm run dev
    # or with Yarn
    yarn dev
    ```

4. **Build for Production**:
    ```bash
    npm run build
    ```

### 🐳 Docker Setup

To use Docker, make sure Docker is installed on your machine. Then, build and run the Docker container:

```bash
docker build . -t nextjs-starter-shadcn
docker run -p 3000:3000 nextjs-starter-shadcn
```

### ☁ Try it in the Cloud

[![Open in VS Code](https://img.shields.io/badge/Open%20in-VS%20Code-blue?logo=visualstudiocode)](https://vscode.dev/github/SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in GitHub Codespaces](https://img.shields.io/badge/Open%20in-GitHub%20Codespaces-blue?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in Repl.it](https://replit.com/badge/github/SiddharthaMaity/nextjs-15-starter-shadcn)](https://replit.com/github/SiddharthaMaity/nextjs-15-starter-shadcn)

[![Open in Glitch](https://img.shields.io/badge/Open%20in-Glitch-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/SiddharthaMaity/nextjs-15-starter-shadcn)


### Uninstall shadcn-ui 

If you no longer need to use a specific component of shadcn-ui, you can safely remove it without affecting the rest of the library.

To remove a single component, follow these steps:

1. **Delete the component file**: 
    Navigate to the registry/new-york-v4 directory and delete the file corresponding to the component you want to remove. For example, if you want to remove the Button component, delete the button.tsx and button.css files.
2. **Remove unnecessary imports**: 
    In your code files, remove any imports related to the component you just deleted. For example:
    ```bash
    import { Button } from '@/registry/new-york-v4/button'
    ```

3. **Remove unnecessary usage**:
    In your code files, remove any usage of the component you just deleted. For example:
    ```bash
    <Button>Click me</Button>
    ```
4. **Update registry directory**: 
    Remove the line corresponding to the component you just deleted from the __registry__/index.tsx file. For example:
    ```bash
    button: {...}
    ```
5. **Delete dependencies**: 
    Check package.json, if components have dependencies, delete it by command. For example:
    ```bash
    npm uninstall @radix-ui/react-navigation-menu
    ```

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
