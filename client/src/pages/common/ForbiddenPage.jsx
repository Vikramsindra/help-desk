import RouteNotice from "../RouteNotice";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4">
      <RouteNotice
        title="Access restricted"
        message="Your account does not have permission to open this page."
        actionLabel="Return home"
        actionTo="/"
      />
    </main>
  );
}
