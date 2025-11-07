/**
 * Auth Infrastructure Layer Exports
 *
 * ⚠️ ARCHITECTURE NOTE: Auth는 유일하게 domain-specific infrastructure를 보유한 도메인
 *
 * 왜 Auth만 Infrastructure Layer를 가지나요?
 * - Token refresh는 Auth 도메인에 특화된 핵심 비즈니스 로직
 * - 다른 도메인에서는 사용하지 않는 Auth 전용 기능
 * - Shared Infrastructure(HttpClient)를 사용하면 무한 루프 발생
 *   (AuthenticatedHttpClient가 401 시 /api/auth/refresh 호출 → 무한 재귀)
 * - 따라서 Auth는 Spring API를 직접 호출해야 함
 *
 * 다른 도메인은 왜 Infrastructure가 없나요?
 * - User, Benefit, Notification, Stamp 등은 Shared Infrastructure 사용
 * - `apps/web/src/infrastructure/` (HttpClient, Storage, Logger 등)
 * - Domain-agnostic한 기술 도구를 공유하여 중복 제거
 *
 * TODO: 다음 상황에서 재검토 필요
 * 1. **Multi-tenant 시스템 전환**
 *    - 여러 인증 제공자 동시 지원 필요 시 (OAuth, SAML, JWT, Session)
 *    - 각 tenant별 다른 Auth 전략 필요 시
 *
 * 2. **Microservices 분리**
 *    - Auth가 독립 서비스로 분리되는 경우
 *    - Auth Service가 별도 배포 단위가 되는 경우
 *
 * 3. **다른 도메인도 domain-specific infrastructure 필요 시**
 *    - 예: Payment 도메인이 PG사 전용 로직 필요
 *    - 패턴의 일관성 검토 필요
 *
 * 현재 구조가 옳은 이유:
 * - YAGNI 원칙: 필요한 것만 구현
 * - 단일 인증 시스템이므로 Auth에 위치하는 것이 자연스러움
 * - 오버엔지니어링 없이 실용적인 구조 유지
 *
 * 참고: RefreshTokenService의 상세 문서는 해당 파일 참조
 */

export { RefreshTokenService } from "./services/refresh-token.service";
