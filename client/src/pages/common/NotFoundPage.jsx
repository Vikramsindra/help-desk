import RouteNotice from "../RouteNotice";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4">
      <RouteNotice
        title="Page not found"
        message="This address does not match a help desk page."
        actionLabel="Go to home"
        actionTo="/"
      />
    </main>
  );
}
