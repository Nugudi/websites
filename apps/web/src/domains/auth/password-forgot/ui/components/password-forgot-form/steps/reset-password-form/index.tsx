import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";

interface ResetPasswordFormProps {
  onPrevious: () => void;
  onSubmit: () => void;
}

export const ResetPasswordForm = ({
  onPrevious,
  onSubmit,
}: ResetPasswordFormProps) => {
  return (
    <VStack>
      <Button onClick={onPrevious}>이전</Button>
      <Button onClick={onSubmit}>제출</Button>
    </VStack>
  );
};
