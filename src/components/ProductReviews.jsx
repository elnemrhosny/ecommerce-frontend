import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useReviews, useReviewMutation } from "../hooks/useReviews";
import { getApiError } from "../functions/apiErrors";
import Icon from "./Icon";
import ConfirmModal from "./ConfirmModal";

function Stars({ rating, size = 14 }) {
  return (
    <span
      role="img"
      className="inline-flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="relative block"
          style={{ width: size, height: size }}
        >
          <Icon
            name="star"
            size={size}
            className="text-gray-300 dark:text-gray-600"
          />
          <span
            className="absolute left-0 top-0 h-full overflow-hidden text-indigo-600 dark:text-indigo-300"
            style={{
              width: `${Math.min(1, Math.max(0, rating - star + 1)) * 100}%`,
            }}
          >
            <Icon name="star" size={size} fill="currentColor" />
          </span>
        </span>
      ))}
    </span>
  );
}
function ReviewForm({ review, pending, onSubmit, onCancel, error }) {
  const [rating, setRating] = useState(Number(review?.rating) || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [validation, setValidation] = useState("");
  return (
    <form
      className="mb-8 rounded-lg border line-border surface p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (rating < 1 || rating > 5) {
          setValidation("Choose a rating from 1 to 5 stars.");
          return;
        }
        setValidation("");
        onSubmit({ rating, comment: comment.trim() });
      }}
      aria-label={review ? "Edit your review" : "Write a review"}
    >
      <h3 className="mb-5 font-display text-2xl">
        {review ? "A fresh point of view." : "How did you find it?"}
      </h3>
      <fieldset disabled={pending}>
        <legend className="field-label">Your rating</legend>
        <div
          className="mb-5 flex gap-2"
          role="radiogroup"
          aria-label="Your rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <label
              key={star}
              className={`star-button relative cursor-pointer ${star <= rating ? "selected" : ""}`}
            >
              <input
                className="peer sr-only"
                type="radio"
                name="rating"
                value={star}
                aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                checked={rating === star}
                onChange={() => setRating(star)}
              />
              <Icon
                name="star"
                size={29}
                fill={star <= rating ? "currentColor" : "none"}
                className="rounded-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4"
              />
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field-label" htmlFor="review-comment">
        Your thoughts <span className="muted font-normal">(optional)</span>
      </label>
      <textarea
        id="review-comment"
        className="field min-h-28 resize-y"
        maxLength={4000}
        placeholder="What do you like? What could be better?"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        disabled={pending}
      />
      {(error || validation) && (
        <p className="inline-error mt-4" role="alert">
          {validation || error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-primary" disabled={pending} type="submit">
          {pending ? "Saving…" : review ? "Save changes" : "Publish review"}
        </button>
        <button
          className="btn-secondary"
          disabled={pending}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
export default function ProductReviews({ productId }) {
  const { user, isLoading: authLoading } = useAuth();
  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
  } = useReviews(productId);
  const create = useReviewMutation(productId, "create");
  const update = useReviewMutation(productId, "update");
  const remove = useReviewMutation(productId, "delete");
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const own = user
    ? reviews.find(
        (review) =>
          review.user_id?.toLowerCase() === user.user_id?.toLowerCase(),
      )
    : undefined;
  const average = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
      reviews.length
    : 0;
  const pending = create.isPending || update.isPending;
  const save = async (values) => {
    setError("");
    setNotice("");
    try {
      await (own ? update : create).mutateAsync(
        own ? { ...values, review_id: own.review_id } : values,
      );
      setWriting(false);
      setNotice(
        own
          ? "Your review has been updated."
          : "Thank you. Your review is now published.",
      );
    } catch (err) {
      setError(
        getApiError(err, "Could not save your review. Please try again."),
      );
    }
  };
  const deleteReview = async () => {
    setError("");
    setNotice("");
    try {
      await remove.mutateAsync({ review_id: own.review_id });
      setWriting(false);
      setNotice("Your review has been removed.");
    } catch (err) {
      setError(
        getApiError(err, "Could not delete your review. Please try again."),
      );
    } finally {
      setConfirmDelete(false);
    }
  };
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mt-16 scroll-mt-28 border-t line-border pt-10 sm:mt-20 sm:pt-14"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow mb-3">The community has a say</p>
          <h2
            id="reviews-heading"
            className="display-title text-4xl sm:text-5xl"
          >
            Real thoughts. Real finds.
          </h2>
        </div>
        {!authLoading &&
          !isLoading &&
          !isError &&
          (user ? (
            <button
              className="btn-secondary"
              onClick={() => {
                setWriting(true);
                setError("");
                setNotice("");
              }}
            >
              {own ? "Edit your review" : "Write a review"}
              <Icon name="plus" size={16} />
            </button>
          ) : (
            <Link
              className="btn-secondary"
              to="/login"
              state={{ from: `/product/${productId}#reviews` }}
            >
              Log in to write a review
              <Icon name="arrow" size={16} />
            </Link>
          ))}
      </div>
      {isLoading ? (
        <p className="muted py-12 text-sm" role="status">
          Loading reviews…
        </p>
      ) : isError ? (
        <div className="empty-state">
          <p>Reviews couldn’t load right now.</p>
          <button className="btn-secondary" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-16">
          <aside>
            <div className="flex items-end gap-3">
              <span className="display-title text-6xl">
                {reviews.length ? average.toFixed(1) : "—"}
              </span>
              <span className="muted mb-2 text-xs">out of 5</span>
            </div>
            <div className="mt-4">
              <Stars rating={average} size={17} />
            </div>
            <p className="muted mb-7 mt-2 text-xs">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                className="mb-3 flex items-center gap-3 text-[11px] muted"
              >
                <span className="w-2">{star}</span>
                <Icon name="star" size={11} />
                <div className="review-bar flex-1">
                  <span
                    style={{
                      width: `${reviews.length ? (reviews.filter((review) => Math.round(Number(review.rating)) === star).length / reviews.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="w-3 text-right">
                  {
                    reviews.filter(
                      (review) => Math.round(Number(review.rating)) === star,
                    ).length
                  }
                </span>
              </div>
            ))}
          </aside>
          <div>
            {notice && (
              <p
                role="status"
                className="mb-6 rounded-md soft-surface px-4 py-3 text-sm"
              >
                {notice}
              </p>
            )}
            {error && !writing && (
              <p role="alert" className="inline-error mb-6">
                {error}
              </p>
            )}
            {writing && user && (
              <ReviewForm
                key={own?.review_id || user.user_id}
                review={own}
                pending={pending}
                error={error}
                onSubmit={save}
                onCancel={() => {
                  setWriting(false);
                  setError("");
                }}
              />
            )}
            {!reviews.length ? (
              <div className="rounded-lg border border-dashed line-border px-6 py-10">
                <h3 className="font-display text-2xl">
                  The first word could be yours.
                </h3>
                <p className="muted mt-3 text-sm leading-6">
                  No reviews yet. Share your point of view to help someone find
                  their next favourite.
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const mine = Boolean(
                  user &&
                  review.user_id?.toLowerCase() === user.user_id?.toLowerCase(),
                );
                return (
                  <article
                    key={review.review_id}
                    className="mb-7 border-b line-border pb-7"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="soft-surface flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium">
                          {(review.reviewer_name || "S")
                            .slice(0, 1)
                            .toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {review.reviewer_name || "ShopName customer"}
                            {mine && (
                              <span className="muted ml-2 text-[10px] font-normal">
                                Your review
                              </span>
                            )}
                          </p>
                          <div className="mt-1.5">
                            <Stars rating={Number(review.rating)} />
                          </div>
                        </div>
                      </div>
                      {mine && (
                        <div className="flex gap-4">
                          <button
                            className="text-xs underline underline-offset-4"
                            disabled={remove.isPending}
                            onClick={() => {
                              setWriting(true);
                              setError("");
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-700 dark:text-red-300"
                            disabled={remove.isPending}
                            onClick={() => setConfirmDelete(true)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                    {review.comment && (
                      <p className="muted mt-5 whitespace-pre-wrap text-sm leading-7">
                        {review.comment}
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmDelete && Boolean(own)}
        onClose={() => {
          if (!remove.isPending) setConfirmDelete(false);
        }}
        onConfirm={deleteReview}
        loading={remove.isPending}
        title="Delete your review?"
        message="Your rating and comment will be removed from this product."
        confirmText="Delete review"
      />
    </section>
  );
}
