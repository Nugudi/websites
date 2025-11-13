import { Input } from "@nugudi/react-components-input";
import { Body, HStack, Title, VStack } from "@nugudi/react-components-layout";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProfileEditFormData } from "../../../schemas/profile-edit.schema";

interface UserPhysicalInfoFormComponentProps {
  register: UseFormRegister<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
  defaultHeight?: number;
  defaultWeight?: number;
}

export const UserPhysicalInfoFormComponent = ({
  register,
  errors,
  defaultHeight,
  defaultWeight,
}: UserPhysicalInfoFormComponentProps) => {
  return (
    <VStack gap={24}>
      <UserPhysicalInfoHeader />
      <UserPhysicalInfoInputFields
        register={register}
        errors={errors}
        defaultHeight={defaultHeight}
        defaultWeight={defaultWeight}
      />
    </VStack>
  );
};

function UserPhysicalInfoHeader() {
  return (
    <VStack gap={4}>
      <Title fontSize="t3">신체 정보</Title>
      <UserPhysicalInfoDescription />
    </VStack>
  );
}

function UserPhysicalInfoDescription() {
  return (
    <Body fontSize="b4" colorShade={500}>
      체형별 맞춤 서비스를 위해 필요하며 다른 사람에게 공개되지 않습니다
    </Body>
  );
}

interface UserPhysicalInfoInputFieldsProps
  extends Pick<
    UserPhysicalInfoFormComponentProps,
    "register" | "errors" | "defaultHeight" | "defaultWeight"
  > {}

function UserPhysicalInfoInputFields({
  register,
  errors,
  defaultHeight,
  defaultWeight,
}: UserPhysicalInfoInputFieldsProps) {
  return (
    <HStack gap={8}>
      <UserHeightInput
        register={register}
        errors={errors}
        defaultHeight={defaultHeight}
      />
      <UserWeightInput
        register={register}
        errors={errors}
        defaultWeight={defaultWeight}
      />
    </HStack>
  );
}

interface UserHeightInputProps
  extends Pick<
    UserPhysicalInfoFormComponentProps,
    "register" | "errors" | "defaultHeight"
  > {}

function UserHeightInput({
  register,
  errors,
  defaultHeight,
}: UserHeightInputProps) {
  return (
    <Input
      label="키"
      variant="filled"
      {...register("height", {
        setValueAs: (v) => {
          if (!v || v === "") return undefined;
          const n = Number(v);
          return Number.isNaN(n) ? undefined : n;
        },
      })}
      defaultValue={defaultHeight}
      type="number"
      placeholder="163"
      isError={!!errors.height}
      rightIcon={<PhysicalUnitText unit="cm" />}
    />
  );
}

interface UserWeightInputProps
  extends Pick<
    UserPhysicalInfoFormComponentProps,
    "register" | "errors" | "defaultWeight"
  > {}

function UserWeightInput({ register, errors }: UserWeightInputProps) {
  return (
    <Input
      label="몸무게"
      variant="filled"
      {...register("weight", {
        setValueAs: (v) => {
          if (!v || v === "") return undefined;
          const n = Number(v);
          return Number.isNaN(n) ? undefined : n;
        },
      })}
      type="number"
      placeholder="80"
      isError={!!errors.weight}
      rightIcon={<PhysicalUnitText unit="kg" />}
    />
  );
}

interface PhysicalUnitTextProps {
  unit: string;
}

function PhysicalUnitText({ unit }: PhysicalUnitTextProps) {
  return (
    <Body fontSize="b3" colorShade={400}>
      {unit}
    </Body>
  );
}
