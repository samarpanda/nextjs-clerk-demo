import { SignIn } from "@clerk/nextjs";
import { NEXT_PUBLIC_CLERK_SIGN_UP_URL } from "@/env/client";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignIn signUpUrl={NEXT_PUBLIC_CLERK_SIGN_UP_URL} />;
    </div>
  );
};

export default SignInPage;
