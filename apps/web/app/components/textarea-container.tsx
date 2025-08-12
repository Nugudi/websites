"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Textarea } from "@nugudi/react-components-textarea";
import "@nugudi/react-components-textarea/style.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as styles from "./textarea-container.css";

const formSchema = z.object({
  review: z.string().min(10, "리뷰는 10자 이상 작성해주세요"),
});

type FormData = z.infer<typeof formSchema>;

export default function TextareaContainer() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.inner}>
        <Textarea
          label="리뷰"
          placeholder="오늘의 메뉴 어떠셨나요? (10자 이상)"
          {...register("review")}
          isError={!!errors.review}
          errorMessage={errors.review?.message}
          maxLength={50}
        />

        <Button type="submit" color="main" variant="brand" disabled={!isValid}>
          제출
        </Button>
      </div>
    </form>
  );
}
