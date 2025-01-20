import fs from "fs/promises";
import path from "path";


interface LoadMessagesOptions {
  locale: string;
  baseDir: string; 
}

function mergeNestedObject(obj: Record<string, any>, keys: string[], value: any) {
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] || {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

export async function loadMessages({ locale, baseDir }: LoadMessagesOptions): Promise<Record<string, any>> {
  const localeDir = path.resolve(baseDir, locale);
  const mergedMessages: Record<string, any> = {};

  
  async function processFile(filePath: string, namespace: string[]): Promise<void> {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const jsonContent = JSON.parse(fileContent);
    if (namespace[namespace.length - 1] === "common") {
      namespace.pop();
    }
    mergeNestedObject(mergedMessages, namespace, jsonContent);

  }


  async function processDirectory(dir: string, namespace: string[] = []): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const newNamespace = [...namespace, entry.name.replace(".json", "")];

      if (entry.isDirectory()) {
      
        await processDirectory(fullPath, newNamespace);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        await processFile(fullPath, newNamespace);
      }
    }
  }

  await processDirectory(localeDir);

  return mergedMessages;
}
