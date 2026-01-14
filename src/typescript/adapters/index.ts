/**
 * Interface Base para Adaptadores de Engine
 * Define o contrato que qualquer engine (Roblox, Unity, etc) deve seguir
 */

import { MapaGerado } from "../core/models/types";

export interface IEngineAdapter {
  /** Nome identificador da engine (ex: "Roblox", "Unity") */
  readonly engineName: string;

  /** Extensão do arquivo gerado (ex: "lua", "cs") */
  readonly fileExtension: string;

  /**
   * Converte um mapa gerado em código executável na engine alvo
   * @param mapa O objeto de mapa gerado pelo core
   * @param options Opções específicas de customização
   */
  generateCode(mapa: MapaGerado, options?: any): string;

  /**
   * Retorna metadados ou estatísticas da construção
   */
  getBuildStats(mapa: MapaGerado): any;
}

export interface RobloxAdapterOptions {
  maxParts?: number;
  blockSize?: number;
  baseFolderName?: string;
  colorScheme?: Record<string, string>;
}
