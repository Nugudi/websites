import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import {
  Body,
  Box,
  Flex,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import {
  type PasswordForgotEmailSchema,
  passwordForgotEmailSchema,
} from "../../../../../schemas/password-forgot-schema";
import { usePasswordForgotStore } from "../../../../../stores/use-password-forgot-store";
import * as styles from "./index.css";

interface EmailFormProps {
  onNext: () => void;
}

export const EmailForm = ({ onNext }: EmailFormProps) => {
  const { setData, data } = usePasswordForgotStore();

  const form = useForm<PasswordForgotEmailSchema>({
    resolver: zodResolver(passwordForgotEmailSchema),
    defaultValues: {
      email: data.email ?? "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: PasswordForgotEmailSchema) => {
    setData({
      ...data,
      email: data.email,
    });
    onNext();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
      <Box className={styles.titleContainer}>
        <Flex direction="column" justify="start" align="start">
          <VStack gap="5">
            <Title fontSize="t1" color="zinc">
              이메일을 입력해주세요
            </Title>
            <Body fontSize="b3" color="zinc">
              가입한 이메일 주소를 입력해주세요.
            </Body>
            <Body fontSize="b3" color="zinc">
              메일로 인증번호를 보내드려요 (스팸 메일함도 확인)
            </Body>
          </VStack>
        </Flex>
      </Box>

      <Box className={styles.inputContainer}>
        <Input
          placeholder="이메일"
          {...form.register("email")}
          isError={!!form.formState.errors.email}
          errorMessage={form.formState.errors.email?.message}
        />
      </Box>

      <Button width="full" type="submit" color="zinc" variant="brand" size="lg">
        다음
      </Button>
    </form>
  );
};
