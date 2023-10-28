// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   RedirectToSignIn,
// } from "@clerk/clerk-react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import KanbanBoard from "@/components/KanbanBoard";
import Banner from "@/components/Banner";
import { env } from "@/env.mjs";
import Layout from "@/components/Layout";

// const queryClient = new QueryClient();

// const clerkPubKey = "pk_test_b3B0aW11bS10ZWFsLTg5LmNsZXJrLmFjY291bnRzLmRldiQ";

function Dashboard() {
  return (
    <div className="h-100 w-100 bg-slate-100">
      <Layout>
        <div className="flex h-screen w-full items-center justify-center text-4xl font-bold">
          Go to your kanbans!
        </div>
      </Layout>
    </div>
  );
}

// export default function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <ClerkProvider publishableKey={clerkPubKey}>
//         <SignedIn>
//           <Dashboard />
//         </SignedIn>
//         <SignedOut>
//           <RedirectToSignIn />
//         </SignedOut>
//       </ClerkProvider>
//     </QueryClientProvider>
//   );
// }

export default function App() {
  return (
    <Layout>
      <div>Hello</div>
    </Layout>
  );
}
