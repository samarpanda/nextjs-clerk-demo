import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <div>
        <h1 className="text-6xl">Nextjs Clerk Integration</h1>
        <p className="text-2xl text-white/60 mb-4">Verify Login & SignUp</p>
        <br />
        <br />
        <p className="text-2xl text-white/60 mb-4">Existing users Login</p>
        <Link href="/sign-in">
          <button className="bg-blue-600 px-4 py-4 rounded-lg text-xl">
            Login
          </button>
        </Link>
        <br />
        <br />
        <p className="text-2xl text-white/60 mb-4">New users SignUp</p>
        <Link href="/sign-up">
          <button className="bg-blue-600 px-4 py-4 rounded-lg text-xl">
            SignUp
          </button>
        </Link>
      </div>
    </div>
  );
}
