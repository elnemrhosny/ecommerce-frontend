import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/OrderCard";
import Spinner from "../components/Spinner";
import Icon from "../components/Icon";
export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState("active");
  const { data, isLoading, isError, refetch } = useOrders(Boolean(user));
  if (!authLoading && !user)
    return <Navigate to="/login" state={{ from: "/orders" }} replace />;
  const orders = data?.[tab] || [];
  return (
    <div className="site-width py-10 sm:py-14">
      <p className="eyebrow mb-4">Good things on their way</p>
      <h1 className="display-title text-5xl sm:text-6xl">Your orders.</h1>
      <div
        className="mt-8 flex gap-6 border-b line-border"
        role="tablist"
        aria-label="Order history"
      >
        {["active", "past"].map((value) => (
          <button
            key={value}
            role="tab"
            id={`orders-tab-${value}`}
            aria-controls="order-list"
            aria-selected={tab === value}
            className={`border-b-2 py-4 text-sm ${tab === value ? "border-gray-900 dark:border-gray-100" : "border-transparent muted"}`}
            tabIndex={tab === value ? 0 : -1}
            onKeyDown={(event) => {
              if (
                ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? "active"
                    : event.key === "End"
                      ? "past"
                      : tab === "active"
                        ? "past"
                        : "active";
                setTab(next);
                document.getElementById(`orders-tab-${next}`)?.focus();
              }
            }}
            onClick={() => setTab(value)}
          >
            {value === "active" ? "Active orders" : "Past orders"}
          </button>
        ))}
      </div>
      <div
        id="order-list"
        role="tabpanel"
        aria-labelledby={`orders-tab-${tab}`}
        className="mt-8"
      >
        {isLoading || authLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="empty-state">
            <p>Your orders couldn’t load.</p>
            <button className="btn-secondary" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        ) : orders.length ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="bag" size={30} />
            <h2 className="font-display text-3xl">
              {tab === "active"
                ? "Nothing on the way just yet."
                : "Your story starts here."}
            </h2>
            <p className="muted text-sm">
              {tab === "active"
                ? "Your active orders will appear here."
                : "Completed orders will be saved here for another look."}
            </p>
            <Link className="btn-primary" to="/">
              Explore the collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
