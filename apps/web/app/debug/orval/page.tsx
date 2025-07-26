"use client";

// import { useGetPostLikeMemberList } from "@nugudi/api";
import { Suspense } from "react";

const OrvalPage = () => {
  return (
    <Suspense>
      <OrvalApiContent />
    </Suspense>
  );
};

const OrvalApiContent = () => {
  // const { data, isLoading, error } = useGetPostLikeMemberList("1", {
  //   likeTargetType: "GENERAL_CHALLENGE_LOG",
  //   cursor: 0,
  //   take: 10,
  // });

  // console.log(data, isLoading, error);
  return (
    <div>
      <h1>Orval API</h1>
    </div>
  );
};

export default OrvalPage;
