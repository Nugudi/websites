# OpenAPI 타입 정의 개선 요청

## 📋 요약

현재 OpenAPI 스펙에서 **모든 응답 필드가 optional로 생성**되고 있어, 프론트엔드에서 불필요한 null 체크와 non-null assertion을 남발하게 됩니다. 이는 코드 가독성 저하, 타입 안전성 저하, 유지보수 부담 증가로 이어지고 있습니다.

---

## 🔍 문제 상황

### 1. Spring Swagger의 기본 동작

**Spring Boot의 springdoc-openapi는 기본적으로 모든 필드를 optional로 생성합니다.**

참고: [springdoc-openapi Issue #2926](https://github.com/springdoc/springdoc-openapi/issues/2926)

> "By default, all fields are optional in OpenAPI/Swagger documentation. Properties need to be explicitly marked as required using annotations."

이로 인해:
- Bean Validation 어노테이션(`@NotNull`, `@NotBlank` 등)을 명시하지 않으면 모든 필드가 optional
- 실제로는 항상 반환되는 필드도 타입 정의상 optional로 표시
- 개발자가 어노테이션을 빼먹으면 자동으로 optional이 되어 발견하기 어려움

---

## 🚨 현재 OpenAPI 타입 정의의 문제점

### 문제 1: SuccessResponse 기본 필드가 Optional

```typescript
// packages/types/dist/openapi.d.ts
SuccessResponseSignUpResponse: {
    timestamp?: string;      // ❌ optional
    success?: boolean;       // ❌ optional
    code?: number;          // ❌ optional
    message?: string;       // optional은 맞음
    data?: SignUpResponse;  // optional은 맞음
}
```

**문제점**: `timestamp`, `success`, `code`는 **모든 API 응답에서 항상 반환되는 필드**인데 optional로 정의되어 있습니다.

### 문제 2: 응답 데이터의 핵심 필드가 Optional

```typescript
// 회원가입 응답
SignUpResponse: {
    userId?: number;              // ❌ 항상 반환되는데 optional
    email?: string | null;        // nullable은 맞음
    nickname?: string;            // ❌ 항상 반환되는데 optional
    accessToken?: string;         // ❌ 항상 반환되는데 optional
    refreshToken?: string;        // ❌ 항상 반환되는데 optional
    accessTokenExpiresAt?: string;   // ❌
    refreshTokenExpiresAt?: string;  // ❌
}

// 구내식당 등록 응답
RegisterCafeteriaResponse: {
    cafeteriaId?: number;         // ❌ 항상 반환되는데 optional
    name?: string;                // ❌ 항상 반환되는데 optional
    takeoutAvailable?: boolean | null;  // ❌ required 필드인데 optional
    // ... 기타 필드들도 동일
}

// 로그인 응답
SocialLoginResponse: {
    userId?: number | null;       // 기존 회원일 때는 항상 있는데 optional
    accessToken?: string | null;  // 기존 회원일 때는 항상 있는데 optional
    refreshToken?: string | null; // 기존 회원일 때는 항상 있는데 optional
    // ...
}
```

---

## 💥 프론트엔드에서 겪는 실제 문제

### 문제 A: Non-null Assertion (`!`) 남발

**모든 Repository에서 반복되는 패턴:**

```typescript
// apps/web/src/domains/cafeteria/repositories/cafeteria-repository.ts

async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
  const response = await this.httpClient.get<SuccessResponseGetCafeteriaResponse>(
    `/api/v1/cafeterias/${id}`,
  );
  return response.data.data!;  // ❌ 타입이 optional이라 ! 강제
}

async getCafeteriaMenuByDate(id: string, date: string): Promise<GetCafeteriaMenuResponse> {
  const response = await this.httpClient.get<SuccessResponseGetCafeteriaMenuResponse>(
    `/api/v1/cafeterias/${id}/menus`,
    { params: { date } },
  );
  return response.data.data!;  // ❌ 또 !
}

async registerCafeteria(data: RegisterCafeteriaRequest): Promise<RegisterCafeteriaResponse> {
  const response = await this.httpClient.post<SuccessResponseRegisterCafeteriaResponse>(
    "/api/v1/cafeterias",
    data,
  );
  return response.data.data!;  // ❌ 또 !
}
```

**같은 문제가 모든 Repository에서 반복:**
- `cafeteria-review-repository.ts`: 10+ 곳에서 `response.data.data!`
- `notification-repository.ts`: 모든 메서드에서 동일
- `stamp-repository.ts`: 모든 메서드에서 동일

**문제점:**
- ✋ Non-null assertion(`!`)은 TypeScript의 타입 체크를 무력화
- ✋ 실제로 null/undefined일 경우 런타임 에러 발생
- ✋ 코드 가독성 저하

### 문제 B: 불필요한 Success 체크

```typescript
// apps/web/src/domains/auth/services/auth-service.ts (Line 184)

const response = await this.httpClient.post(...);

if (!response.data.success || !response.data.data) {  // ❌ 불필요한 체크
  throw new Error("Login failed");
}

const loginResponseData = response.data.data;
```

```typescript
// apps/web/src/domains/user/services/user-service.ts (Line 24)

const response = await this.httpClient.post(...);

if (!response.success || !response.data) {  // ❌ 불필요한 체크
  throw new Error("Failed to check nickname");
}
```

**문제점:**
- `success`가 required라면 이 체크가 불필요
- 모든 Service 메서드마다 반복되는 보일러플레이트 코드

### 문제 C: 데이터 필드의 개별 Null 체크

```typescript
// apps/web/src/domains/auth/services/auth-service.ts (Line 195-200)

const loginResponseData = response.data.data;

// 기존 회원인 경우
if (
  !loginResponseData.accessToken ||      // ❌ required 필드인데 체크 필요
  !loginResponseData.refreshToken ||     // ❌
  !loginResponseData.userId ||           // ❌
  !loginResponseData.nickname            // ❌
) {
  throw new Error("Invalid login response");
}

// 이후 사용
await this.sessionManager.saveSession({
  accessToken: loginResponseData.accessToken,   // 위에서 체크했으니 안전
  refreshToken: loginResponseData.refreshToken,
  userId: loginResponseData.userId,
});
```

**문제점:**
- 백엔드가 항상 반환하는 필드인데 프론트에서 일일이 체크해야 함
- 타입 정의만 올바르면 이 체크가 전부 불필요

---

## 📊 영향 범위

### 현재 코드베이스 영향

```bash
# Non-null assertion 사용 횟수
$ grep -r "response\.data\.data!" apps/web/src/domains | wc -l
47개 이상

# Success 체크 패턴
$ grep -r "!response.*success" apps/web/src/domains | wc -l
15개 이상

# 불필요한 null 체크
$ grep -r "!.*accessToken.*||.*!.*refreshToken" apps/web/src/domains | wc -l
8개 이상
```

### 영향받는 도메인
- ✅ Auth (로그인, 회원가입, 토큰 갱신)
- ✅ User (프로필, 닉네임 체크)
- ✅ Cafeteria (구내식당 CRUD, 리뷰, 댓글)
- ✅ Notification (알림 조회)
- ✅ Stamp (스탬프 관리)
- ✅ Benefit (혜택 조회)

**거의 모든 API 호출이 영향을 받고 있습니다.**

---

## ✅ 해결 방안

### 1. SuccessResponse 기본 필드를 Required로 변경

```java
// 백엔드 SuccessResponse DTO
public class SuccessResponse<T> {
    @Schema(description = "응답 시간", required = true)
    @NotNull
    private LocalDateTime timestamp;

    @Schema(description = "성공 여부", required = true)
    @NotNull
    private Boolean success;

    @Schema(description = "응답 코드", required = true)
    @NotNull
    private Integer code;

    @Schema(description = "메시지")
    private String message;  // nullable OK

    @Schema(description = "응답 데이터")
    private T data;  // nullable OK (에러 응답 시 null)
}
```

### 2. 실제 Required 필드에 Bean Validation 추가

```java
// 회원가입 응답
public class SignUpResponse {
    @Schema(description = "사용자 ID", required = true)
    @NotNull
    private Long userId;

    @Schema(description = "이메일", nullable = true)
    private String email;  // 소셜 로그인은 null 가능

    @Schema(description = "닉네임", required = true)
    @NotNull
    private String nickname;

    @Schema(description = "액세스 토큰", required = true)
    @NotNull
    private String accessToken;

    @Schema(description = "리프레시 토큰", required = true)
    @NotNull
    private String refreshToken;

    // ...
}
```

### 3. 구내식당 응답 개선

```java
public class RegisterCafeteriaResponse {
    @Schema(description = "구내식당 ID", required = true)
    @NotNull
    private Long cafeteriaId;

    @Schema(description = "구내식당 이름", required = true)
    @NotNull
    private String name;

    @Schema(description = "포장 가능 여부", required = true)
    @NotNull
    private Boolean takeoutAvailable;  // 요청에서 required → 응답에서도 required

    @Schema(description = "위도", nullable = true)
    private Double latitude;  // optional & nullable

    @Schema(description = "경도", nullable = true)
    private Double longitude;  // optional & nullable

    // ...
}
```

### 4. OpenApiCustomiser로 일괄 적용 (선택사항)

개별 DTO 수정이 번거로울 경우, 전역 설정으로 처리:

```java
@Component
public class NullableIfNotRequiredOpenApiCustomizer implements OpenApiCustomiser {
    @Override
    public void customise(OpenAPI openApi) {
        // SuccessResponse의 기본 필드는 required로 강제
        Schema successResponseSchema = openApi.getComponents()
            .getSchemas().get("SuccessResponse");

        if (successResponseSchema != null) {
            successResponseSchema.setRequired(List.of("timestamp", "success", "code"));
        }

        // 나머지는 @NotNull 기반으로 자동 처리
        for (Schema schema : openApi.getComponents().getSchemas().values()) {
            if (schema.getProperties() == null) continue;

            schema.getProperties().forEach((name, value) -> {
                if (schema.getRequired() == null || !schema.getRequired().contains(name)) {
                    value.setNullable(true);
                }
            });
        }
    }
}
```

---

## 🎯 기대 효과

### Before (현재)

```typescript
// ❌ 불필요한 코드들
async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
  const response = await this.httpClient.get<SuccessResponseGetCafeteriaResponse>(
    `/api/v1/cafeterias/${id}`
  );

  if (!response.data.success || !response.data.data) {  // 불필요
    throw new Error("Failed");
  }

  return response.data.data!;  // Non-null assertion
}

// Service에서도
if (!loginResponseData.accessToken || !loginResponseData.refreshToken) {
  throw new Error("Invalid response");  // 불필요한 체크
}
```

### After (개선 후)

```typescript
// ✅ 깔끔한 코드
async getCafeteriaById(id: string): Promise<GetCafeteriaResponse> {
  const response = await this.httpClient.get<SuccessResponseGetCafeteriaResponse>(
    `/api/v1/cafeterias/${id}`
  );

  return response.data.data;  // 그냥 바로 반환!
}

// Service에서도
await this.sessionManager.saveSession({
  accessToken: loginResponseData.accessToken,    // 바로 사용!
  refreshToken: loginResponseData.refreshToken,  // 타입이 보장
  userId: loginResponseData.userId,
});
```

### 개선 효과

1. **타입 안전성 향상**
   - Non-null assertion(`!`) 제거 → TypeScript 타입 체크 정상 작동
   - 컴파일 타임에 오류 발견 가능

2. **코드 가독성 향상**
   - 불필요한 null 체크 제거
   - 보일러플레이트 코드 감소

3. **유지보수성 향상**
   - 47+ 곳의 `!` 제거
   - 15+ 곳의 불필요한 success 체크 제거
   - 신규 API 추가 시 동일한 패턴 반복 불필요

4. **런타임 안정성 향상**
   - Non-null assertion으로 인한 잠재적 런타임 에러 방지

---

## 📝 체크리스트

### 우선순위 HIGH

- [ ] `SuccessResponse<T>`의 기본 필드 required 처리
  - [ ] `timestamp: LocalDateTime` → `@NotNull` + `@Schema(required = true)`
  - [ ] `success: Boolean` → `@NotNull` + `@Schema(required = true)`
  - [ ] `code: Integer` → `@NotNull` + `@Schema(required = true)`

- [ ] 인증 관련 응답 개선
  - [ ] `SignUpResponse` 필수 필드 required 처리
  - [ ] `LocalLoginResponse` 필수 필드 required 처리
  - [ ] `SocialLoginResponse` 필수 필드 required 처리 (상태별 분기 고려)

### 우선순위 MEDIUM

- [ ] 구내식당 도메인 응답 개선
  - [ ] `RegisterCafeteriaResponse` 필수 필드 required 처리
  - [ ] `GetCafeteriaResponse` 필수 필드 required 처리
  - [ ] `CreateReviewResponse` - 전체 리소스 반환으로 변경 (현재 reviewId만 반환)

- [ ] 사용자 도메인 응답 개선
  - [ ] `NicknameCheckResponse.available` required 처리
  - [ ] `GetMyProfileResponse` 필수 필드 required 처리

### 우선순위 LOW

- [ ] 기타 도메인 응답 개선
  - [ ] Notification, Stamp, Benefit 등

---

## 🔗 참고 자료

1. [springdoc-openapi Issue #2926 - Make require-default configurable](https://github.com/springdoc/springdoc-openapi/issues/2926)
2. [Stack Overflow - SpringFox Swagger Optional and Mandatory fields](https://stackoverflow.com/questions/43771283/springfox-swagger-optional-and-mandatory-fields-in-model)
3. [springdoc-openapi Issue #1275 - Mark optional parameters as nullable](https://github.com/springdoc/springdoc-openapi/issues/1275)
4. [springdoc-openapi FAQ](https://springdoc.org/faq.html)

---

## 📌 추가 논의 사항

### 1. Local vs Social 회원가입 응답 분리

현재 하나의 `SignUpResponse`만 존재하는데, 실제로는:
- Local 회원가입: email이 항상 있음
- Social 회원가입: email이 null일 수 있음

이를 별도 타입으로 분리하는 것이 더 정확할 수 있습니다.

### 2. Create/Update 후 전체 리소스 반환

현재 `CreateReviewResponse`는 `reviewId`만 반환하는데, 전체 리뷰 데이터를 반환하면:
- 프론트엔드에서 추가 조회 불필요
- UX 개선 (즉시 화면에 표시 가능)

이 부분도 함께 검토 부탁드립니다.

---

**작성일**: 2025-01-04
**작성자**: 프론트엔드팀
**관련 이슈**: OpenAPI 타입 정의 개선
