# @nugudi/react-components-input-otp

React InputOTP 컴포넌트 라이브러리입니다. OTP(일회용 비밀번호) 입력을 위한 간단하고 유연한 인터페이스를 제공합니다.

## 설치

```bash
npm install @nugudi/react-components-input-otp
```

## 기본 사용법

### Uncontrolled 방식 (간단)

```tsx
import { InputOTP } from "@nugudi/react-components-input-otp";

const App = () => {
  return (
    <InputOTP
      defaultValue="123"
      onChange={(value) => console.log("OTP:", value)}
    />
  );
};
```

### Controlled 방식

```tsx
import { InputOTP } from "@nugudi/react-components-input-otp";
import { useState } from "react";

const App = () => {
  const [otp, setOtp] = useState("");

  return <InputOTP value={otp} onChange={setOtp} />;
};
```

### react-hook-form과 함께 사용

```tsx
import { InputOTP } from "@nugudi/react-components-input-otp";
import { useForm, Controller } from "react-hook-form";

const App = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("OTP:", data.otp);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="otp"
        control={control}
        rules={{ required: "OTP를 입력해주세요" }}
        render={({ field, fieldState }) => (
          <InputOTP
            {...field}
            isError={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <button type="submit">제출</button>
    </form>
  );
};
```

### 커스텀 길이

```tsx
<InputOTP length={4} />
```

### 에러 상태

```tsx
<InputOTP isError={true} errorMessage="잘못된 인증번호입니다." />
```

### 알파벳 입력

```tsx
<InputOTP inputMode="text" pattern="[a-zA-Z]*" />
```

### 영숫자 입력

```tsx
<InputOTP inputMode="text" pattern="[a-zA-Z0-9]*" />
```

## 패턴 예시

### 숫자만 허용 (기본)

```tsx
pattern = "[0-9]*";
```

### 대소문자 구분 없는 알파벳

```tsx
pattern = "[a-zA-Z]*";
```

### 영숫자 조합

```tsx
pattern = "[a-zA-Z0-9]*";
```

## 기능

- ✅ 자동 포커스 이동
- ✅ 백스페이스로 이전 필드 이동
- ✅ 화살표 키로 필드 간 이동
- ✅ 붙여넣기 지원
- ✅ 입력 패턴 검증
- ✅ 에러 상태 표시
- ✅ 모바일 키보드 최적화
- ✅ react-hook-form 호환성
- ✅ Controlled/Uncontrolled 모드 지원

## 접근성

이 컴포넌트는 웹 접근성을 고려하여 설계되었습니다:

- 키보드 네비게이션 지원 (화살표 키, 백스페이스)
- 적절한 `inputMode`와 `pattern` 속성으로 모바일 경험 최적화
- 에러 상태에서 명확한 시각적 피드백 제공
