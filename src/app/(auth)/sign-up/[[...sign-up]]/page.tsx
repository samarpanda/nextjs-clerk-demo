import { SignUp } from "@clerk/nextjs";
import {
  NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL,
} from "@/env/client";

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignUp
        path={NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        routing="path"
        signInUrl={NEXT_PUBLIC_CLERK_SIGN_IN_URL}
        forceRedirectUrl={NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL}
      />
    </div>
  );
};

export default SignUpPage;
