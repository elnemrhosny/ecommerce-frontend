import { Link } from "react-router-dom";
import Icon from "./Icon";
export default function Footer() {
  return (
    <footer className="mt-20 border-t line-border">
      <div className="site-width py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <Link className="wordmark" to="/">
              shopname<span className="wordmark-dot">.</span>
            </Link>
            <p className="muted mt-5 max-w-xs text-sm leading-7">
              A considered collection for the way you live.
              <br />
              Find your everyday favourites.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-14 text-sm sm:gap-24">
            <div className="flex flex-col items-start gap-3">
              <span className="eyebrow mb-2">Explore</span>
              <Link to="/">The collection</Link>
              <Link to="/?sort_by=created_at&order=DESC">Latest finds</Link>
              <Link to="/wishlist">Your wishlist</Link>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="eyebrow mb-2">Your space</span>
              <Link to="/profile">My account</Link>
              <Link to="/orders">My orders</Link>
              <Link to="/cart" className="inline-flex items-center gap-2">
                Shopping bag <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
        </div>
        <div className="muted mt-12 flex flex-wrap justify-between gap-3 border-t line-border pt-6 text-[11px]">
          <span>© {new Date().getFullYear()} ShopName.</span>
          <span>Thoughtfully simple. Yours to discover.</span>
        </div>
      </div>
    </footer>
  );
}
