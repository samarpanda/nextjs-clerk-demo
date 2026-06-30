import { UserButton } from "@clerk/nextjs";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen w-screen relative">
      <aside className="absolute w-50 top-0 left-0 h-full border-r border-black/10">
        NextJS Clerk
      </aside>
      <div className="ml-50">
        <header className="h-15 border-b border-black/10">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <UserButton />
          </div>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
