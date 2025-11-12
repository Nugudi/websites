import { TERMS_AND_CONDITIONS_LIST } from "@auth/presentation/shared/constants";
import type { TermsComponentProps } from "@auth/presentation/shared/types";
import Agreement from "@core/ui/components/agreement";
import type { MouseEvent } from "react";

export const Terms = ({
  agreements,
  onAgreementChange,
  onAllAgreementChange,
}: TermsComponentProps) => {
  const handleAllAgreement = (_: MouseEvent<HTMLElement>, checked: boolean) => {
    onAllAgreementChange(checked);
  };

  const handleTermAgreement =
    (termId: string) => (_: MouseEvent<HTMLElement>, checked: boolean) => {
      onAgreementChange(termId, checked);
    };

  const isAllTermsAgreed = Object.values(agreements).every(
    (isAgreed) => isAgreed,
  );

  return (
    <Agreement>
      <Agreement.Title checked={isAllTermsAgreed} onChange={handleAllAgreement}>
        약관 전체 동의
      </Agreement.Title>
      {TERMS_AND_CONDITIONS_LIST.map(({ id, title, link, mandatory }) => (
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
