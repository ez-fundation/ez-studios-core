
import * as fs from 'fs';
import * as path from 'path';

export interface TemplateContext {
  [key: string]: string | number | boolean;
}

export class TemplateEngine {
  private templatesCache: Map<string, string> = new Map();
  private baseDir: string;

  constructor(baseDir: string = 'src/templates') {
    // Resolve absolute path based on CWD or relative to this file
    this.baseDir = path.resolve(process.cwd(), baseDir);
  }

  /**
   * Carrega um template do disco (com cache simples)
   */
  public loadTemplate(templatePath: string): string {
    if (this.templatesCache.has(templatePath)) {
      return this.templatesCache.get(templatePath)!;
    }

    const fullPath = path.join(this.baseDir, templatePath);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      this.templatesCache.set(templatePath, content);
      return content;
    } catch (e) {
      console.error(`[TemplateEngine] Erro ao carregar template: ${fullPath}`, e);
      throw new Error(`Template not found: ${templatePath}`);
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
