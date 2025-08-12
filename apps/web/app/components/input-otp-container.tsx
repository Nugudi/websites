import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { InputOTP } from "@nugudi/react-components-input-otp";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import * as styles from "./input-otp-container.css";

const otpSchema = z.object({
  otp: z.string().min(6, "6자리 인증번호를 입력해주세요"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function InputOTPContainer() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OTPFormData) => {
    console.log("OTP 제출:", data.otp);
    alert(`OTP 제출: ${data.otp}`);
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <InputOTP
              {...field}
              length={6}
              isError={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Button type="submit" color="main" disabled={!isValid}>
          인증번호 확인
        </Button>
      </form>
    </div>
  );
}
