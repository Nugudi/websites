# @nugudi/react-components-textarea

Textarea 컴포넌트 라이브러리입니다.

## 설치

```bash
pnpm add @nugudi/react-components-textarea
```

## 사용법

### 기본 사용

```tsx
import { Textarea } from "@nugudi/react-components-textarea";
import "@nugudi/react-components-textarea/style.css";

function App() {
  return <Textarea placeholder="오늘의 메뉴 어떠셨나요?" />;
}
```

### 라벨과 함께 사용

```tsx
<Textarea label="의견" placeholder="오늘의 메뉴 어떠셨나요?" />
```

### 에러 상태

```tsx
<Textarea
  label="리뷰"
  placeholder="리뷰를 작성해주세요"
  isError={true}
  errorMessage="리뷰는 10자 이상 작성해주세요."
/>
```

### 크기 조절 옵션

```tsx
// 크기 조절 불가
<Textarea
  placeholder="크기 조절이 불가능합니다"
  resize="none"
/>

// 세로로만 조절 (기본값)
<Textarea
  placeholder="세로로만 조절 가능"
  resize="vertical"
/>

// 가로로만 조절
<Textarea
  placeholder="가로로만 조절 가능"
  resize="horizontal"
/>

// 모든 방향 조절
<Textarea
  placeholder="모든 방향으로 조절 가능"
  resize="both"
/>
```

### 문자 수 제한

`maxLength` prop을 사용하여 입력 가능한 최대 문자 수를 제한할 수 있습니다. 문자 수 제한이 설정되면 우하단에 현재 글자 수와 최대 글자 수가 표시됩니다.

```tsx
// 기본 문자 수 제한
<Textarea placeholder="최대 100자까지 입력할 수 있습니다" maxLength={100} />;

// Controlled 컴포넌트로 사용
function ControlledTextarea() {
  const [value, setValue] = React.useState("");

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      maxLength={200}
      placeholder="최대 200자까지 입력 가능"
    />
  );
}

// React Hook Form과 함께 사용
<Textarea
  {...register("content")}
  maxLength={150}
  placeholder="최대 150자까지 입력 가능"
  isError={!!errors.content}
  errorMessage={errors.content?.message}
/>;
```

## React Hook Form과 함께 사용하기

### 기본 사용법

```tsx
import { useForm } from "react-hook-form";
import { Textarea } from "@nugudi/react-components-textarea";

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        {...register("description", {
          required: "필수 입력 항목입니다",
          minLength: {
            value: 10,
            message: "10자 이상 입력해주세요",
          },
        })}
        label="설명"
        placeholder="설명을 입력해주세요"
        isError={!!errors.description}
        errorMessage={errors.description?.message}
      />
      <button type="submit">제출</button>
    </form>
  );
}
```

### Zod와 함께 사용하기

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@nugudi/react-components-textarea";

const formSchema = z.object({
  review: z.string().min(10, "리뷰는 10자 이상 작성해주세요"),
  feedback: z.string().min(5, "피드백은 5자 이상 작성해주세요"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: "",
      feedback: "",
      description: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea
        label="리뷰"
        placeholder="오늘의 메뉴 어떠셨나요? (10자 이상)"
        {...register("review")}
        isError={!!errors.review}
        errorMessage={errors.review?.message}
      />

      <Textarea
        label="피드백"
        placeholder="개선사항을 알려주세요 (5자 이상)"
        {...register("feedback")}
        isError={!!errors.feedback}
        errorMessage={errors.feedback?.message}
      />

      <Textarea
        label="추가 설명 (선택)"
        placeholder="추가로 하고 싶은 말씀이 있으시면 작성해주세요"
        {...register("description")}
        resize="none"
      />

      <button type="submit">제출</button>
    </form>
  );
}
```

### Controller 사용하기

더 복잡한 로직이 필요한 경우 Controller를 사용할 수 있습니다:

```tsx
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@nugudi/react-components-textarea";

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{
          required: "필수 입력 항목입니다",
          validate: (value) => {
            if (value.includes("금지어")) {
              return "금지어를 포함할 수 없습니다";
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="내용"
            placeholder="내용을 입력해주세요"
            isError={!!fieldState.error}
            errorMessage={fieldState.error?.message}
          />
        )}
      />
      <button type="submit">제출</button>
    </form>
  );
}
```

## Hooks

### useTextarea

Textarea의 상태 관리와 접근성을 위한 커스텀 훅입니다.

```tsx
import { useTextarea } from "@nugudi/react-components-textarea";

function CustomTextarea() {
  const { textareaProps, isFocused } = useTextarea({
    invalid: false,
    errorMessage: "에러 메시지",
    // ... 기타 props
  });

  return <textarea {...textareaProps} />;
}
```

## 접근성

- `aria-invalid`: 유효하지 않은 입력 상태를 나타냅니다
- `aria-describedby`: 에러 메시지와 연결합니다
- `aria-required`: 필수 입력 필드를 나타냅니다
- 라벨과 textarea는 `htmlFor`와 `id`로 연결됩니다
