import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Box, Flex, Title, VStack } from "@nugudi/react-components-layout";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProfileEditFormData } from "../../../schemas/profile-edit.schema";

interface UserBasicInfoFormComponentProps {
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
  onCheckNickname: () => void;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCheckingNickname: boolean;
}

export const UserBasicInfoFormComponent = ({
  register,
  errors,
  onCheckNickname,
  onNicknameChange,
  isCheckingNickname,
}: UserBasicInfoFormComponentProps) => {
  return (
    <VStack gap={24}>
      <UserBasicInfoTitle />
      <UserNicknameField
        register={register}
        errors={errors}
        onCheckNickname={onCheckNickname}
        onNicknameChange={onNicknameChange}
        isCheckingNickname={isCheckingNickname}
      />
    </VStack>
  );
};

function UserBasicInfoTitle() {
  return <Title fontSize="t3">기본 정보</Title>;
}

type UserNicknameFieldProps = Pick<
  UserBasicInfoFormComponentProps,
  | "register"
  | "errors"
  | "onCheckNickname"
  | "onNicknameChange"
  | "isCheckingNickname"
>;

function UserNicknameField({
  register,
  errors,
  onCheckNickname,
  onNicknameChange,
  isCheckingNickname,
}: UserNicknameFieldProps) {
  return (
    <Flex gap={8} align="end">
      <Box style={{ flex: 1 }}>
        <Input
          label="닉네임"
          variant="filled"
          {...register("nickname")}
          onChange={(e) => {
            register("nickname").onChange(e);
            onNicknameChange(e);
          }}
          placeholder="정조이"
          isError={!!errors.nickname}
          errorMessage={errors.nickname?.message}
        />
      </Box>
      <NicknameDuplicateCheckButton
        onCheckNickname={onCheckNickname}
        isCheckingNickname={isCheckingNickname}
      />
    </Flex>
  );
}

interface NicknameDuplicateCheckButtonProps
  extends Pick<
    UserBasicInfoFormComponentProps,
    "onCheckNickname" | "isCheckingNickname"
  > {}

function NicknameDuplicateCheckButton({
  onCheckNickname,
  isCheckingNickname,
}: NicknameDuplicateCheckButtonProps) {
  return (
    <Button
      type="button"
      size="md"
      color="zinc"
      onClick={onCheckNickname}
      disabled={isCheckingNickname}
      isLoading={isCheckingNickname}
    >
      중복 체크
    </Button>
  );
}
