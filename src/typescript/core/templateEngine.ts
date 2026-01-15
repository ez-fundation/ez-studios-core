
// Isomorphic check
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Lazy imports for Node only
let fs: any = null;
let path: any = null;

if (isNode) {
  // Use require or dynamic import to avoid Vite bundling issues if possible, 
  // but since this is TS/ESM, we might need a different approach.
  // For now, let's just guard the calls.
}

export interface TemplateContext {
  [key: string]: string | number | boolean;
}

export class TemplateEngine {
  private templatesCache: Map<string, string> = new Map();
  private baseDir: string;

  constructor(baseDir: string = 'src/templates') {
    this.baseDir = baseDir;
    
    // Attempt to resolve only in Node
    if (isNode) {
        try {
            path = require('path');
            fs = require('fs');
            this.baseDir = path.resolve(process.cwd(), baseDir);
        } catch (e) {
            console.warn("[TemplateEngine] Node modules not available in this environment.");
        }
    }
  }

  /**
   * Carrega um template (Disco no Node, Mock/Fetch no Browser)
   */
  public loadTemplate(templatePath: string): string {
    if (this.templatesCache.has(templatePath)) {
      return this.templatesCache.get(templatePath)!;
    }

    if (isNode && fs && path) {
        const fullPath = path.join(this.baseDir, templatePath);
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          this.templatesCache.set(templatePath, content);
          return content;
        } catch (e) {
          console.error(`[TemplateEngine] Erro ao carregar template: ${fullPath}`, e);
          throw new Error(`Template not found: ${templatePath}`);
        }
    } else {
        // Browser Fallback: For now, return a placeholder or empty string to avoid crash
        // In the future, this could be a fetch() or a pre-populated map
        console.warn(`[TemplateEngine] Browser environment: Dynamic loading of ${templatePath} not implemented.`);
        return `-- [EZ Studios] Browser Template Fallback for ${templatePath}\n-- Logic generation limited in browser context.`;
    }
  }

  /**
   * Limpa o cache de templates (Hot Reload)
   */
  public clearCache(): void {
    this.templatesCache.clear();
    console.log("[TemplateEngine] Cache limpo.");
  }

  /**
   * Processa um template substituindo variáveis {{key}}
   */
  public render(templatePath: string, context: TemplateContext): string {
    const template = this.loadTemplate(templatePath);
    return this.inject(template, context);
  }

  /**
   * Injeta variáveis em uma string crua
   */
  public inject(rawString: string, context: TemplateContext): string {
    return rawString.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return context[key] !== undefined ? String(context[key]) : match;
    });
  }
}

export const globalTemplateEngine = new TemplateEngine();
