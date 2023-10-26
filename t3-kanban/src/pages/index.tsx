import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanBoard from "@/components/KanbanBoard";
import Banner from "@/components/Banner";
import { env } from "@/env.mjs"


const queryClient = new QueryClient();

const clerkPubKey = "pk_test_b3B0aW11bS10ZWFsLTg5LmNsZXJrLmFjY291bnRzLmRldiQ"

function Dashboard() {
  return (
    <div className="bg-slate-100 h-100 w-100">
    <Banner />
    <KanbanBoard />
  </div>
  )
}
if (!clerkPubKey) {
  throw "Missing Publishable Key";
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <SignedIn>
          <Dashboard/>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

