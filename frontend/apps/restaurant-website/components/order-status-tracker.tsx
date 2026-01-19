"use client";

import { CheckCircle2, Clock, Truck, MapPin, AlertCircle } from "lucide-react";
import { useThemeColors } from "@/lib/hooks/use-theme";

export interface OrderStatus {
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  timestamp?: string;
}

interface OrderStatusTrackerProps {
  statuses: OrderStatus[];
  currentStatus: OrderStatus["status"];
  locale?: "en" | "ar";
}

/**
 * Order status tracker component showing progression
 * Uses theme CSS variables for colors
 */
export function OrderStatusTracker({
  statuses,
  currentStatus,
  locale = "en",
}: OrderStatusTrackerProps) {
  const isRTL = locale === "ar";
  const themeColors = useThemeColors() as any;

  // Fallback colors if theme not loaded
  const bgColor = themeColors?.background || "#ffffff";
  const textColor = themeColors?.text || "#1f2937";
  const borderColor = themeColors?.border || "#e5e7eb";

  const statusConfig = {
    pending: {
      label: locale === "en" ? "Pending" : "قيد الانتظار",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    confirmed: {
      label: locale === "en" ? "Confirmed" : "تم التأكيد",
      icon: CheckCircle2,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    preparing: {
      label: locale === "en" ? "Preparing" : "جاري التحضير",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    ready: {
      label: locale === "en" ? "Ready" : "جاهز",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    out_for_delivery: {
      label: locale === "en" ? "Out for Delivery" : "في الطريق",
      icon: Truck,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    delivered: {
      label: locale === "en" ? "Delivered" : "تم التسليم",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    cancelled: {
      label: locale === "en" ? "Cancelled" : "ملغي",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
  };

  const timeline = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
  ] as const;

  const getStatusIndex = (status: string) => timeline.indexOf(status as any);
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="w-full">
      {isCancelled ? (
        // Cancelled Status
        <div
          className="border rounded-lg p-6"
          style={{
            backgroundColor: "#fee2e2",
            borderColor: "#fecaca",
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle
              className="h-6 w-6"
              style={{ color: "#ef4444" }}
            />
            <div>
              <h3
                className="font-semibold text-lg"
                style={{ color: "#991b1b" }}
              >
                {statusConfig.cancelled.label}
              </h3>
              <p
                className="text-sm"
                style={{ color: `hsl(var(--theme-text) / 0.6)` }}
              >
                {locale === "en"
                  ? "This order has been cancelled"
                  : "تم إلغاء هذا الطلب"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Active Order Timeline
        <div className={`${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Timeline */}
          <div className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
            {timeline.map((status, index) => {
              const config = statusConfig[status as keyof typeof statusConfig];
              const Icon = config.icon;
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <div
                  key={status}
                  className={`flex-1 relative ${isRTL ? "text-right" : ""}`}
                >
                  {/* Status Circle */}
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-all border-2"
                    style={
                      isCompleted || isActive
                        ? {
                            backgroundColor: config.bgColor.includes("yellow")
                              ? "#fef3c7"
                              : config.bgColor.includes("blue")
                                ? "#dbeafe"
                                : config.bgColor.includes("orange")
                                  ? "#fed7aa"
                                  : config.bgColor.includes("green")
                                    ? "#dcfce7"
                                    : config.bgColor.includes("purple")
                                      ? "#e9d5ff"
                                      : "#f3f4f6",
                            borderColor: config.borderColor
                              .split(" ")[1]
                              ?.replace("border-", ""),
                          }
                        : {
                            backgroundColor: `hsl(var(--theme-background) / 0.5)`,
                            borderColor: borderColor,
                          }
                    }
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{
                        color: isCompleted || isActive
                          ? config.color
                              .split("-")
                              .slice(1)
                              .join("-")
                          : `hsl(var(--theme-text) / 0.3)`,
                      }}
                    />
                  </div>

                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                    <div
                      className={`absolute top-6 h-1 w-full ${
                        isRTL ? "right-full pr-3" : "left-full pl-3"
                      }`}
                      style={{
                        width: "100%",
                        backgroundColor: isCompleted
                          ? config.bgColor.includes("yellow")
                            ? "#fbbf24"
                            : config.bgColor.includes("blue")
                              ? "#3b82f6"
                              : config.bgColor.includes("orange")
                                ? "#f97316"
                                : config.bgColor.includes("green")
                                  ? "#22c55e"
                                  : config.bgColor.includes("purple")
                                    ? "#a855f7"
                                    : "#f97316"
                          : `hsl(var(--theme-text) / 0.1)`,
                      }}
                    />
                  )}

                  {/* Status Label */}
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: isActive
                        ? themeColors?.primary || "#f97316"
                        : isCompleted
                          ? textColor
                          : `hsl(var(--theme-text) / 0.6)`,
                      fontWeight: isActive ? "bold" : "500",
                    }}
                  >
                    {config.label}
                  </p>

                  {/* Time */}
                  {statuses[index]?.timestamp && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: `hsl(var(--theme-text) / 0.5)` }}
                    >
                      {new Date(statuses[index].timestamp!).toLocaleString(
                        locale === "ar" ? "ar-EG" : "en-US"
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Status Description */}
          <div
            className="mt-8 p-4 border rounded-lg"
            style={{
              backgroundColor: statusConfig[currentStatus as keyof typeof statusConfig].bgColor.includes("yellow")
                ? "#fef3c7"
                : statusConfig[currentStatus as keyof typeof statusConfig].bgColor.includes("blue")
                  ? "#dbeafe"
                  : statusConfig[currentStatus as keyof typeof statusConfig].bgColor.includes("orange")
                    ? "#fed7aa"
                    : statusConfig[currentStatus as keyof typeof statusConfig].bgColor.includes("green")
                      ? "#dcfce7"
                      : statusConfig[currentStatus as keyof typeof statusConfig].bgColor.includes("purple")
                        ? "#e9d5ff"
                        : bgColor,
              borderColor: borderColor,
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{ color: textColor }}
            >
              {statusConfig[currentStatus as keyof typeof statusConfig].label}
            </p>
            <p
              className="text-sm"
              style={{ color: `hsl(var(--theme-text) / 0.7)` }}
            >
              {currentStatus === "pending" &&
                (locale === "en"
                  ? "Your order is waiting to be confirmed"
                  : "طلبك قيد الانتظار للتأكيد")}
              {currentStatus === "confirmed" &&
                (locale === "en"
                  ? "Your order has been confirmed and will be prepared shortly"
                  : "تم تأكيد طلبك وسيتم تحضيره قريباً")}
              {currentStatus === "preparing" &&
                (locale === "en"
                  ? "Our team is preparing your delicious food"
                  : "فريقنا يقوم بتحضير طعامك اللذيذ")}
              {currentStatus === "ready" &&
                (locale === "en"
                  ? "Your order is ready for pickup or out for delivery"
                  : "طلبك جاهز للالتقاط أو للتسليم")}
              {currentStatus === "out_for_delivery" &&
                (locale === "en"
                  ? "Your order is on its way to you"
                  : "طلبك في الطريق إليك")}
              {currentStatus === "delivered" &&
                (locale === "en"
                  ? "Your order has been delivered. Thank you for your order!"
                  : "تم تسليم طلبك. شكراً لطلبك!")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
