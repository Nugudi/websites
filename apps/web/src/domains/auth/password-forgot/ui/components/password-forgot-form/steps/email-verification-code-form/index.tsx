import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { InputOTP } from "@nugudi/react-components-input-otp";
import {
  Box,
  Flex,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import {
  type PasswordForgotEmailVerificationCodeSchema,
  passwordForgotEmailVerificationCodeSchema,
} from "../../../../../schemas/password-forgot-schema";
import { usePasswordForgotStore } from "../../../../../stores/use-password-forgot-store";
import * as styles from "./index.css";

interface EmailVerificationCodeFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const EmailVerificationCodeForm = ({
  onPrevious,
  onNext,
}: EmailVerificationCodeFormProps) => {
  const { setData, data } = usePasswordForgotStore();

  const form = useForm<PasswordForgotEmailVerificationCodeSchema>({
    resolver: zodResolver(passwordForgotEmailVerificationCodeSchema),
    defaultValues: {
      code: data.code ?? "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: PasswordForgotEmailVerificationCodeSchema) => {
    setData({
      ...data,
      code: data.code,
    });
    onNext();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Flex direction="column" justify="start" align="start">
          <VStack gap="5">
            <Title fontSize="t1" color="zinc">
              인증 번호를 입력해주세요
            </Title>
          </VStack>
        </Flex>
      </Box>

      <Box className={styles.inputOtpContainer}>
        <InputOTP
          length={6}
          value={form.watch("code")}
          isError={!!form.formState.errors.code}
          errorMessage={form.formState.errors.code?.message}
          onChange={(value) => {
            form.setValue("code", value);
          }}
        />
      </Box>

      <HStack gap="5">
        <Button
          type="button"
          color="zinc"
          variant="neutral"
          size="lg"
          onClick={onPrevious}
          width="full"
        >
          이전
        </Button>
        <Button
          type="submit"
          color="zinc"
          variant="brand"
          size="lg"
          width="full"
        >
          다음
        </Button>
      </HStack>
    </form>
  );
};
