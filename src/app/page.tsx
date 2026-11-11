import { Suspense } from "react";
import { InvitationApp } from "@/components/InvitationApp";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-forest text-soft">
          <p className="font-display text-xl">Loading invitation…</p>
        </div>
      }
    >
      <InvitationApp />
    </Suspense>
  );
}
