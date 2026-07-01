import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "../src/app/page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => {
  const mockedFunctions = {
    auth: () => new Promise((resolve) => resolve({ userId: null })),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useUser: () => ({
      isSignedIn: false,
      user: null,
    }),
  };

  return mockedFunctions;
});

test("Home Page", async () => {
  render(await HomePage());
  expect(screen.getByText(`Nextjs Clerk Integration`)).toBeTruthy();
});

// test("redirects signed-in user", async () => {
//   await HomePage();
//   expect(redirect).toHaveBeenCalledWith("/dashboard");
// });
