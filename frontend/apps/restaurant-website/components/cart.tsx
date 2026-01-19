"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@pos-saas/ui";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useThemeColors } from "@/lib/hooks/use-theme";

interface CartProps {
  locale?: "en" | "ar";
}

/**
 * Shopping cart component
 * Uses theme CSS variables for colors
 */
export function Cart({ locale = "en" }: CartProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateNotes = useCartStore((state) => state.updateNotes);
  const getTotal = useCartStore((state) => state.getTotal);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const themeColors = useThemeColors() as any;

  const isRTL = locale === "ar";
  const total = getTotal();
  const itemCount = getTotalItems();

  // Fallback colors if theme not loaded
  const bgColor = (themeColors as any)?.background || "#ffffff";
  const textColor = (themeColors as any)?.text || "#1f2937";
  const borderColor = (themeColors as any)?.border || "#e5e7eb";
  const primaryColor = (themeColors as any)?.primary || "#f97316";

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart
          className="h-16 w-16 mx-auto mb-4"
          style={{ color: `hsl(var(--theme-text) / 0.4)` }}
        />
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: textColor }}
        >
          {locale === "en" ? "Your cart is empty" : "سلتك فارغة"}
        </h3>
        <p
          className="mb-6"
          style={{ color: `hsl(var(--theme-text) / 0.6)` }}
        >
          {locale === "en"
            ? "Add some delicious items to get started"
            : "أضف بعض العناصر اللذيذة للبدء"}
        </p>
        <Link href={`/${locale}/menu`}>
          <Button variant="default">
            {locale === "en" ? "Continue Shopping" : "متابعة التسوق"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div
        className="rounded-lg shadow-md overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div
          style={{
            borderColor: borderColor,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-6 flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
              style={{
                borderBottomColor: borderColor,
                borderBottomWidth: "1px",
              }}
            >
              {/* Image */}
              {item.image ? (
                <div
                  className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: `hsl(var(--theme-background) / 0.5)`,
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `hsl(var(--theme-background) / 0.5)`,
                  }}
                >
                  <ShoppingCart
                    className="h-8 w-8"
                    style={{ color: `hsl(var(--theme-text) / 0.4)` }}
                  />
                </div>
              )}

              {/* Item Details */}
              <div className="flex-1">
                <h3
                  className="font-semibold text-lg mb-1"
                  style={{ color: textColor }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: `hsl(var(--theme-text) / 0.7)` }}
                >
                  ${item.price.toFixed(2)}{" "}
                  {locale === "en" ? "each" : "لكل واحد"}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                    }
                    className="p-1 rounded transition-colors"
                    style={{
                      color: textColor,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = `hsl(var(--theme-text) / 0.05)`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className="px-4 py-1 rounded font-semibold min-w-[3rem] text-center"
                    style={{
                      backgroundColor: `hsl(var(--theme-background) / 0.8)`,
                      color: textColor,
                      borderColor: borderColor,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 rounded transition-colors"
                    style={{
                      color: textColor,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = `hsl(var(--theme-text) / 0.05)`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Special Notes */}
                <textarea
                  value={item.notes || ""}
                  onChange={(e) => updateNotes(item.productId, e.target.value)}
                  placeholder={locale === "en" ? "Add special notes..." : "أضف ملاحظات خاصة..."}
                  style={{
                    backgroundColor: `hsl(var(--theme-background) / 0.8)`,
                    color: textColor,
                    borderColor: borderColor,
                  }}
                  className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = primaryColor)
                  }
                  rows={2}
                />
              </div>

              {/* Price & Delete */}
              <div
                className={`flex flex-col items-end gap-4 ${
                  isRTL ? "items-start" : ""
                }`}
              >
                <div style={{ textAlign: isRTL ? "left" : "right" }}>
                  <p
                    className="text-sm"
                    style={{ color: `hsl(var(--theme-text) / 0.6)` }}
                  >
                    {locale === "en" ? "Total" : "الإجمالي"}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: primaryColor }}
                  >
                    ${item.total.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 rounded transition-colors"
                  style={{
                    color: "#ef4444",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#fee2e2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div
        className="rounded-lg shadow-md p-6 space-y-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="space-y-2">
          <div
            className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            style={{ color: `hsl(var(--theme-text) / 0.7)` }}
          >
            <span>{locale === "en" ? "Subtotal" : "المجموع"}</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div
            className={`flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}
            style={{ color: `hsl(var(--theme-text) / 0.7)` }}
          >
            <span>{locale === "en" ? "Delivery" : "التوصيل"}</span>
            <span>${(total > 50 ? 0 : 5).toFixed(2)}</span>
          </div>
          {total > 50 && (
            <p
              className="text-sm"
              style={{ color: "#16a34a" }}
            >
              {locale === "en"
                ? "Free delivery on orders over $50!"
                : "توصيل مجاني على الطلبات فوق 50 دولار!"}
            </p>
          )}
        </div>

        <div
          className="pt-4"
          style={{
            borderTopColor: borderColor,
            borderTopWidth: "1px",
          }}
        >
          <div
            className={`flex justify-between text-lg font-bold mb-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{ color: textColor }}
          >
            <span>{locale === "en" ? "Total" : "الإجمالي"}</span>
            <span style={{ color: primaryColor }}>
              ${(total + (total > 50 ? 0 : 5)).toFixed(2)}
            </span>
          </div>

          <div className="space-y-3">
            <Link href={`/${locale}/checkout`}>
              <Button className="w-full" size="lg">
                {locale === "en" ? "Proceed to Checkout" : "متابعة الدفع"}
              </Button>
            </Link>
            <Link href={`/${locale}/menu`}>
              <Button variant="outline" className="w-full" size="lg">
                {locale === "en" ? "Continue Shopping" : "متابعة التسوق"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Clear Cart */}
        <button
          onClick={() => {
            if (
              window.confirm(
                locale === "en" ? "Clear cart?" : "مسح السلة؟"
              )
            ) {
              clearCart();
            }
          }}
          className="w-full font-semibold py-2 rounded transition-colors"
          style={{
            color: "#dc2626",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#fee2e2")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {locale === "en" ? "Clear Cart" : "مسح السلة"}
        </button>
      </div>
    </div>
  );
}
