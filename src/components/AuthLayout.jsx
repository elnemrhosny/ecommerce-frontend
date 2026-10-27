import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function AuthLayout({ eyebrow, title, description, children }) {
  return (
    <div className="site-width py-6 sm:py-12">
      <div className="auth-layout overflow-hidden rounded-lg border line-border surface">
        <section className="px-6 py-10 sm:px-14 sm:py-14">
          <Link
            className="muted mb-10 inline-flex items-center gap-2 text-xs"
            to="/"
          >
            <Icon name="back" size={15} />
            Back to the collection
          </Link>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="display-title text-4xl sm:text-5xl">{title}</h1>
          <p className="muted mb-8 mt-4 max-w-md text-sm leading-6">
            {description}
          </p>
          {children}
        </section>
        <aside className="auth-story flex flex-col justify-between">
          <p className="eyebrow">Your everyday, considered.</p>
          <div className="relative z-10">
            <img
              src="/everyday-edit.svg"
              alt=""
              className="mb-8 w-full rounded"
            />
            <h2 className="display-title text-5xl">
              Good finds.
              <br />
              <span className="italic">Better together.</span>
            </h2>
            <p className="muted mt-6 max-w-xs text-sm leading-7">
              A place for your favourites, your orders, and your point of view.
            </p>
          </div>
          <p className="eyebrow mt-12 text-[9px]">The ShopName community</p>
        </aside>
      </div>
    </div>
  );
}
