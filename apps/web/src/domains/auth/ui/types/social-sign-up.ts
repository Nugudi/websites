/**
 * Social Sign Up Types
 *
 * Type definitions for social sign-up flow
 */

export interface TermsAgreementState {
  [key: string]: boolean;
}

export interface TermsComponentProps {
  agreements: TermsAgreementState;
  onAgreementChange: (termId: string, checked: boolean) => void;
  onAllAgreementChange: (checked: boolean) => void;
}
