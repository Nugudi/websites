import { VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/core/ui";
import { UserProfileEditFormSectionMock } from "../../sections/user-profile-edit-form-section-mock";

export const UserProfileEditView = () => {
  return (
    <VStack h="full" minH="100dvh">
      <NavBar title="프로필 수정" />
      <UserProfileEditFormSectionMock />
    </VStack>
  );
};
