"use client";

import { AuthPointsBalance } from "../../components/points-balance";

export const AuthPointsBalanceSection = () => {
  // TODO: Replace with actual data from API
  const pointsBalance = 3000;

  return <AuthPointsBalance balance={pointsBalance} />;
};
