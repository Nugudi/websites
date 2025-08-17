import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";

interface EmailVerificationCodeFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const EmailVerificationCodeForm = ({
  onPrevious,
  onNext,
}: EmailVerificationCodeFormProps) => {
  return (
    <VStack>
      <Button onClick={onPrevious}>이전</Button>
      <Button onClick={onNext}>다음</Button>
    </VStack>
  );
};
