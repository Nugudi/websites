import { redirect } from "next/navigation";

const SignInPage = () => {
  redirect("/auth/login");
};

export default SignInPage;
