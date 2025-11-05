/**
 * Terms Types
 *
 * Type definitions for terms and conditions
 */

export interface TermsAgreementState {
  [key: string]: boolean;
}

export interface TermsComponentProps {
  agreements: TermsAgreementState;
  onAgreementChange: (termId: string, checked: boolean) => void;
  onAllAgreementChange: (checked: boolean) => void;
}
