import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";

export default function WorkspacePlaceholder({ title, description }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="rounded-lg border border-line bg-white">
        <EmptyState
          title="Workspace ready"
          description="This route and its shared layout are in place. The feature screen will be built in a later phase."
        />
      </div>
    </>
  );
}
