"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HeartIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod 스키마 정의
const formSchema = z.object({
  name: z.string().min(2, "최소 2글자 이상 입력해주세요"),
  email: z.email("올바른 이메일 주소를 입력해주세요"),
});

type FormData = z.infer<typeof formSchema>;

/**
 * 상세한 사용법은 packages/react/hooks/input/README.md 참조
 */
export default function InputContainer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert(`제출 완료!\n이름: ${data.name}\n이메일: ${data.email}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "400px",
        marginTop: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="이름"
            placeholder="이름을 입력하세요"
            {...register("name")}
            isError={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <Input
            label="이메일"
            placeholder="이메일을 입력하세요"
            {...register("email")}
            isError={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>
        <HeartIcon />
        <Button type="submit" color="main" variant="brand">
          제출
        </Button>
      </div>
    </form>
  );
}
