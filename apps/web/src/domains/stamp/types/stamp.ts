type Stamp = {
  id: string;
  cafeteriaId: string;
  cafeteriaName: string;
  cafeteriaAddress: string;
};

type StampWithStatus = Stamp & {
  isCollected: boolean;
  collectedAt?: Date;
};

type StampWithPoints = Stamp & {
  points: number;
};

type StampWithVerification = Stamp & {
  isVerifying: boolean;
  verificationError?: string;
};

export type StampForCollection = StampWithStatus &
  StampWithPoints &
  StampWithVerification;

export type StampOptimistic = StampForCollection & {
  optimistic: true;
};
