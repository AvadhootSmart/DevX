import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="px-4 sm:px-10">
      <div className="mt-10 flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl">
        <p className="text-sm font-medium text-muted-foreground tabular-nums">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href="/problems">Browse problems</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
