import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, useDeleteItemCart, useModifyCart } from "../hooks/useCart";
import { useSubmitOrder } from "../hooks/useOrders";
import { useAuth } from "../contexts/AuthContext";
import { getApiError } from "../functions/apiErrors";
import CartItem from "../components/CartItem";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";
export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: cart, isLoading, isError, refetch } = useCart();
  const modify = useModifyCart();
  const remove = useDeleteItemCart();
  const order = useSubmitOrder();
  const [error, setError] = useState("");
  const [removeItem, setRemoveItem] = useState(null);
  const pending = modify.isPending || remove.isPending;
  const updateQuantity = async (values) => {
    setError("");
    try {
      await modify.mutateAsync(values);
    } catch (err) {
      setError(getApiError(err, "Could not update the quantity."));
    }
  };
  const confirmRemove = async () => {
    setError("");
    try {
      await remove.mutateAsync(removeItem);
      setRemoveItem(null);
    } catch (err) {
      setError(getApiError(err, "Could not remove this item."));
      setRemoveItem(null);
    }
  };
  const checkout = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (!user.email_verified) {
      setError(
        "Please verify your email from your account before checking out.",
      );
      return;
    }
    setError("");
    try {
      const result = await order.mutateAsync({});
      if (!result?.redirectUrl) throw new Error("Missing checkout URL");
      window.location.assign(result.redirectUrl);
    } catch (err) {
      setError(getApiError(err, "Checkout could not start. Please try again."));
    }
  };
  return (
    <div className="site-width py-10 sm:py-14">
      <p className="eyebrow mb-4">Your everyday, in the making</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display-title text-5xl sm:text-6xl">
          The shopping bag.
        </h1>
        <Link to="/" className="text-link text-xs">
          Keep exploring
          <Icon name="arrow" size={15} />
        </Link>
      </div>
      {isLoading ? (
        <div className="py-16">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="empty-state mt-10">
          <p>Your bag couldn’t load.</p>
          <button className="btn-secondary" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : !cart?.items?.length ? (
        <div className="empty-state mt-10">
          <Icon name="bag" size={32} />
          <h2 className="font-display text-3xl">Room for something good.</h2>
          <p className="muted text-sm">
            Your bag is empty. Find your next everyday favourite.
          </p>
          <Link to="/" className="btn-primary">
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <section aria-label="Bag items">
            <div className="flex justify-between border-b line-border pb-4 text-[10px] uppercase tracking-widest muted">
              <span>
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
                in your bag
              </span>
              <span>Subtotal</span>
            </div>
            {cart.items.map((item) => (
              <CartItem
                key={item.item_id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={setRemoveItem}
                pending={pending}
              />
            ))}
          </section>
          <aside className="rounded-md soft-surface p-6 sm:p-8">
            <h2 className="font-display text-3xl">The essentials.</h2>
            <div className="mt-7 flex justify-between text-sm">
              <span className="muted">Items subtotal</span>
              <span>${Number(cart.total_price).toFixed(2)}</span>
            </div>
            <p className="muted mt-4 text-xs leading-6">
              Any additional charges are shown during checkout.
            </p>
            <div className="mt-6 flex justify-between border-t line-border pt-6 text-lg">
              <span>Total</span>
              <span className="tabular-nums">
                ${Number(cart.total_price).toFixed(2)}
              </span>
            </div>
            <button
              className="btn-primary mt-7 w-full"
              disabled={pending || order.isPending}
              onClick={checkout}
            >
              {order.isPending
                ? "Opening checkout…"
                : user
                  ? "Continue to checkout"
                  : "Log in to checkout"}
              <Icon name="arrow" size={17} />
            </button>
            {user && !user.email_verified && (
              <Link className="text-link mt-4 text-xs" to="/profile">
                Verify your email
              </Link>
            )}
            {error && (
              <p role="alert" className="inline-error mt-4">
                {error}
              </p>
            )}
          </aside>
        </div>
      )}
      <ConfirmModal
        isOpen={Boolean(removeItem)}
        loading={remove.isPending}
        onClose={() => {
          if (!remove.isPending) setRemoveItem(null);
        }}
        onConfirm={confirmRemove}
        title="Remove this item?"
        message="You can always find it again in the collection."
        confirmText="Remove item"
      />
    </div>
  );
}
