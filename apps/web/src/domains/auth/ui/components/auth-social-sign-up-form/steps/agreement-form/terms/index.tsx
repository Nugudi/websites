import type { MouseEvent } from "react";
import Agreement from "@/src/shared/interface-adapters/components/agreement";
import { SOCIAL_TERMS_LIST } from "../../../../../../constants/social-sign-up";
import type { TermsComponentProps } from "../../../../../../types/social-sign-up";

export const SocialTerms = ({
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
      {SOCIAL_TERMS_LIST.map(({ id, title, link, mandatory }) => (
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
