export interface Term {
  id: number;
  title: string;
  link: string;
  mandatory: boolean;
}

export interface TermsAgreements {
  [key: string]: boolean;
}

export interface TermsProps {
  agreements: TermsAgreements;
  onAgreementChange: (termId: string, checked: boolean) => void;
  onAllAgreementChange: (checked: boolean) => void;
}
