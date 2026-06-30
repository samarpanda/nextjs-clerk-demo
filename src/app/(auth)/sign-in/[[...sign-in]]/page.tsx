import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SignIn signUpUrl="/sign-up" />;
    </div>
  );
};

export default SignInPage;
