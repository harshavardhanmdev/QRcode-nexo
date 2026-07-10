import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-accent-text">
        404
      </p>
      <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        This page didn&apos;t scan
      </h1>
      <p className="mt-3 max-w-md text-fg-muted">
        The link you followed doesn&apos;t exist (or moved). The generator is
        always at the front door.
      </p>
      <div className="mt-8">
        <Button href="/">Back to the generator</Button>
      </div>
    </div>
  );
}
