import { redirect } from "next/navigation";
import { expect, test, vi } from "vitest";

import HomePage from "../src/app/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => {
  const mockedFunctions = {
    auth: () =>
      new Promise((resolve) =>
        resolve({ userId: "user_2NNNEWasdfasdfsfadsC" }),
      ),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: "user_2NNNEWasdfasdfsfadsC",
        fullName: "Samar Panda",
      },
    }),
  };

  return mockedFunctions;
});
test("redirects signed-in user", async () => {
  await HomePage();
  expect(redirect).toHaveBeenCalledWith("/dashboard");
});
