import { GoogleProvider } from "../providers/google-provider";
import { KakaoProvider } from "../providers/kakao-provider";
import { AuthError } from "./errors";
import type { Provider, ProviderRegistry, ProviderType } from "./provider";

class ProviderRegistryImplements {
  private providers: Map<ProviderType, Provider> = new Map();

  constructor() {
    this.registerProvider(new KakaoProvider());
    this.registerProvider(new GoogleProvider());
  }

  /**
   * Provider 등록
   * @param provider Provider
   */
  private registerProvider(provider: Provider) {
    this.providers.set(provider.type, provider);
  }

  /**
   * Provider 조회 (타입 안전)
   */
  getProvider<T extends ProviderType>(type: T): ProviderRegistry[T] {
    const provider = this.providers.get(type);
    if (!provider) {
      throw AuthError.providerNotFound(type);
    }
    return provider as ProviderRegistry[T];
  }

  /**
   * 모든 Provider 목록 조회
   */
  getAllProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Provider 존재 여부 확인
   */
  hasProvider(type: ProviderType): boolean {
    return this.providers.has(type);
  }
}

/**
 * Provider Registry 싱글톤
 */
export const providerRegistry = new ProviderRegistryImplements();
