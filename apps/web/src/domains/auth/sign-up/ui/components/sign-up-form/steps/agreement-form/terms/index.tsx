import type { MouseEvent } from "react";
import Agreement from "@/src/shared/ui/components/agreement";
import { 약관목록 } from "../../../../../../constants/sign-up";
import type { TermsProps } from "../../../../../../types/sign-up";

const Terms = ({
  agreements,
  onAgreementChange,
  onAllAgreementChange,
}: TermsProps) => {
  const handleAllAgreement = (_: MouseEvent<HTMLElement>, checked: boolean) => {
    onAllAgreementChange(checked);
  };

  const handleTermAgreement =
    (termId: string) => (_: MouseEvent<HTMLElement>, checked: boolean) => {
      onAgreementChange(termId, checked);
    };

  const 모든약관이_동의되었는가 = Object.values(agreements).every(
    (동의여부) => 동의여부,
  );

  return (
    <Agreement>
      <Agreement.Title
        checked={모든약관이_동의되었는가}
        onChange={handleAllAgreement}
      >
        약관 전체 동의
      </Agreement.Title>
      {약관목록.map(({ id, title, link, mandatory }) => (
        <Agreement.Description
          key={id}
          link={link}
          checked={agreements[String(id)] ?? false}
          onChange={handleTermAgreement(String(id))}
        >
          {mandatory ? "[필수]" : "(선택)"} {title}
        </Agreement.Description>
      ))}
    </Agreement>
  );
};

export default Terms;
