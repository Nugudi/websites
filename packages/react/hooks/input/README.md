# @nugudi/react-hooks-input

Input 컴포넌트를 위한 React Hook 라이브러리입니다.

## 설치

```bash
pnpm add @nugudi/react-hooks-input
```

## 사용법

### useInput Hook

`useInput`은 input 요소의 기본적인 상태 관리와 접근성 속성을 제공합니다.

```tsx
import { useInput } from "@nugudi/react-hooks-input";

function MyComponent() {
  const { inputProps, isFocused } = useInput({
    isDisabled: false,
    isRequired: true,
    isInvalid: false,
    errorMessage: "필수 입력 항목입니다",
  });

  return (
    <div>
      <input {...inputProps} />
      {isFocused && <span>입력 중...</span>}
    </div>
  );
}
```

### React Hook Form과 함께 사용하기

복잡한 폼 검증이 필요한 경우 React Hook Form과 함께 사용하는 것을 권장합니다.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nugudi/react-components-input";
import { z } from "zod";

// Zod 스키마 정의
const schema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
      "비밀번호는 대소문자, 숫자를 포함해야 합니다"
    ),
});

type FormData = z.infer<typeof schema>;

function FormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="이메일"
        {...register("email")}
        isError={!!errors.email}
        errorMessage={errors.email?.message}
      />
      <Input
        label="비밀번호"
        type="password"
        {...register("password")}
        isError={!!errors.password}
        errorMessage={errors.password?.message}
      />

      <button type="submit">제출</button>
    </form>
  );
}
```
