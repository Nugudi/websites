"use client";

import { UserPointsBalance } from "../../components/user-points-balance";

export const UserPointsBalanceSection = () => {
  // TODO: Replace with actual data from API
  const pointsBalance = 3000;

  return <UserPointsBalance balance={pointsBalance} />;
};
