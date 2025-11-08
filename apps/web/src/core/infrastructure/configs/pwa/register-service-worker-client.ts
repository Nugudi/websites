"use client";

import { useEffect } from "react";

import { registerServiceWorker } from "./register-service-worker";

export const RegisterServiceWorkerClient = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
};
