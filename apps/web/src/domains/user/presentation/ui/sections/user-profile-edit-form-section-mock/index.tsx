"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  type ProfileEditFormData,
  profileEditSchema,
} from "../../../schemas/profile-edit.schema";
import { UserBasicInfoFormComponent } from "../../components/user-basic-info-form-component";
import { UserPhysicalInfoFormComponent } from "../../components/user-physical-info-form-component";

const MOCK_PROFILE = {
  nickname: "정조이",
  height: 163,
  weight: 40,
};

export const UserProfileEditFormSectionMock = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: MOCK_PROFILE,
  });

  const onSubmit = (data: ProfileEditFormData) => {
    console.log("폼 제출:", data);
    router.push("/profile");
  };

  return (
    <VStack
      as="form"
      p={16}
      onSubmit={handleSubmit(onSubmit)}
      h="full"
      justify="space-between"
      grow={1}
    >
      <VStack gap={64}>
        <UserBasicInfoFormComponent
          register={register}
          errors={errors}
          onCheckNickname={() => console.log("닉네임 중복 체크")}
          onNicknameChange={() => {}}
          isCheckingNickname={false}
        />

        <UserPhysicalInfoFormComponent register={register} errors={errors} />
      </VStack>

      <Button type="submit" size="lg" variant="brand" color="zinc" width="full">
        수정 완료
      </Button>
    </VStack>
  );
};
