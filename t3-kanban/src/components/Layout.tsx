import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import { useState } from "react";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const clerkPubKey = "pk_test_b3B0aW11bS10ZWFsLTg5LmNsZXJrLmFjY291bnRzLmRldiQ";

interface LayoutProps {
  children: React.ReactNode;
}
if (!clerkPubKey) {
  throw "Missing Publishable Key";
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey}>
          <SignedIn></SignedIn>
          <Navbar setSidebarOpen={setSidebarOpen} />
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <KanbanBoard>{children}</KanbanBoard>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </ClerkProvider>
      </QueryClientProvider>
    </div>
  );
};

export default Layout;
