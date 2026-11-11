import { useDeferredValue, useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import EmptyState from "../../components/common/EmptyState";
import FilterDropdown from "../../components/common/FilterDropdown";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import { formatDate } from "../../lib/utils";
import { adminService } from "../../services/adminService";

const activityOptions = [
  { value: "", label: "Any status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export default function CustomerManagementPage() {
  const [search, setSearch] = useState("");
  const [activity, setActivity] = useState("");
  const [page, setPage] = useState(1);
  const [requestKey, setRequestKey] = useState(0);
  const [result, setResult] = useState({
    query: null,
    items: [],
    pagination: null,
    error: null,
  });
  const [viewing, setViewing] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deactivating, setDeactivating] = useState(null);
  const [updating, setUpdating] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const query = JSON.stringify({ search: deferredSearch, activity, page });

  useEffect(() => {
    let active = true;
    const params = {
      page,
      limit: 10,
      search: deferredSearch.trim() || undefined,
    };
    if (activity !== "") params.isActive = activity;
    adminService
      .listCustomers(params)
      .then((response) => {
        if (active)
          setResult({
            query,
            items: response.data?.items || [],
            pagination: response.data?.pagination || null,
            error: null,
          });
      })
      .catch((error) => {
        if (active) setResult({ query, items: [], pagination: null, error });
      });
    return () => {
      active = false;
    };
  }, [activity, deferredSearch, page, query, requestKey]);

  const loading = result.query !== query;
  const customers = loading ? [] : result.items;
  const error = loading ? null : result.error;

  const showCustomer = async (customer) => {
    setViewing({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    });
    setViewLoading(true);
    try {
      const response = await adminService.getCustomer(customer.id);
      setViewing(response.data);
    } catch (viewError) {
      toast.error(viewError.message || "Could not load customer details.");
    } finally {
      setViewLoading(false);
    }
  };

  const updateCustomerStatus = async (customer, isActive) => {
    if (!customer) return;
    setUpdating(true);
    try {
      await adminService.updateCustomer(customer.id, { isActive });
      toast.success(
        isActive
          ? "Customer account activated."
          : "Customer account deactivated.",
      );
      setDeactivating(null);
      setRequestKey((key) => key + 1);
    } catch (updateError) {
      toast.error(updateError.message || "Could not update this account.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Customer accounts"
        description="View customer account details and manage account access."
      />
      <section className="rounded-lg border border-line bg-white">
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[minmax(14rem,1fr)_auto]">
          <label className="flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <Search size={16} aria-hidden="true" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name or email"
              aria-label="Search customers"
            />
          </label>
          <FilterDropdown
            label="Account"
            value={activity}
            options={activityOptions}
            onChange={(value) => {
              setActivity(value);
              setPage(1);
            }}
          />
        </div>
        {error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-rose-700" role="alert">
              {error.message || "Could not load customers."}
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand"
              type="button"
              onClick={() => setRequestKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <LoadingSpinner label="Loading customers" />
        ) : customers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-mist/70 text-[11px] uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-mist/40">
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-ink">
                        {customer.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {customer.email}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-sm capitalize text-ink">
                      {customer.role}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${customer.isActive === false ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}
                      >
                        {customer.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-semibold text-brand hover:bg-mist"
                          type="button"
                          onClick={() => showCustomer(customer)}
                        >
                          <Eye size={14} /> View
                        </button>
                        {customer.isActive === false ? (
                          <button
                            className="rounded px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            type="button"
                            onClick={() => updateCustomerStatus(customer, true)}
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            className="rounded px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            type="button"
                            onClick={() => setDeactivating(customer)}
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <EmptyState
              title="No customers found"
              description="Try another search or account filter."
            />
          </div>
        )}
        {!loading && result.pagination?.totalItems > 0 && (
          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </section>

      <Modal
        open={Boolean(viewing)}
        onClose={() => !viewLoading && setViewing(null)}
        title="Customer details"
        description={viewing?.email}
      >
        {viewLoading ? (
          <LoadingSpinner label="Loading customer details" />
        ) : (
          viewing && (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-muted">Name</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {viewing.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Role</dt>
                <dd className="mt-1 text-sm font-semibold capitalize text-ink">
                  {viewing.role}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Account</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {viewing.isActive === false ? "Inactive" : "Active"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-muted">Created</dt>
                <dd className="mt-1 text-sm text-ink">
                  {formatDate(viewing.createdAt)}
                </dd>
              </div>
            </dl>
          )
        )}
        {viewing && (
          <div className="mt-5 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setViewing(null)}
              disabled={viewLoading}
            >
              Close
            </Button>
          </div>
        )}
      </Modal>
      <ConfirmationDialog
        open={Boolean(deactivating && deactivating.isActive !== false)}
        onClose={() => !updating && setDeactivating(null)}
        onConfirm={() => updateCustomerStatus(deactivating, false)}
        title="Deactivate customer account?"
        description={`${deactivating?.name || "This customer"} will be signed out and unable to access the workspace.`}
        confirmLabel="Deactivate"
        busy={updating}
      />
    </>
  );
}
