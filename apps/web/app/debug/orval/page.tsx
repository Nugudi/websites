"use client";

import { useGetPetByIdSuspense } from "@nugudi/api";
import { Suspense } from "react";

const OrvalPage = () => {
  return (
    <Suspense>
      <OrvalApiContent />
    </Suspense>
  );
};

const OrvalApiContent = () => {
  const { data, isLoading, error } = useGetPetByIdSuspense(1);

  console.log(data);

  // console.log(data, isLoading, error);
  return (
    <div>
      <h1>Orval API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default OrvalPage;
