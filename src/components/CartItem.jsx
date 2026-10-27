import { Link } from "react-router-dom";
import Image from "./Image";
import Icon from "./Icon";
export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  pending = false,
}) {
  return (
    <article className="flex gap-4 border-b line-border py-6 sm:gap-6">
      <Link
        to={`/product/${item.product_id}`}
        className="w-24 shrink-0 sm:w-32"
      >
        <Image
          src={item.image_url}
          alt={item.name}
          aspectRatio="4/5"
          containerClassName="rounded"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to={`/product/${item.product_id}`}
              className="text-sm font-medium hover:underline"
            >
              {item.name}
            </Link>
            <p className="muted mt-2 text-xs">
              ${Number(item.price).toFixed(2)} each
            </p>
          </div>
          <button
            className="icon-button -mt-3 -mr-2"
            disabled={pending}
            onClick={() => onRemove({ item_id: item.item_id })}
            aria-label={`Remove ${item.name} from bag`}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center rounded border line-border">
            <button
              className="icon-button h-8 w-8 rounded-none"
              disabled={pending || Number(item.quantity) <= 1}
              onClick={() =>
                onUpdateQuantity({
                  item_id: item.item_id,
                  quantity: Number(item.quantity) - 1,
                })
              }
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Icon name="minus" size={13} />
            </button>
            <span
              className="w-7 text-center text-xs tabular-nums"
              aria-label="Quantity"
            >
              {item.quantity}
            </span>
            <button
              className="icon-button h-8 w-8 rounded-none"
              disabled={pending}
              onClick={() =>
                onUpdateQuantity({
                  item_id: item.item_id,
                  quantity: Number(item.quantity) + 1,
                })
              }
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Icon name="plus" size={13} />
            </button>
          </div>
          <p className="text-sm tabular-nums">
            ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
          </p>
        </div>
      </div>
    </article>
  );
}
