"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from "@/lib/utils/theme-colors";
import { useThemeColors } from "@/lib/hooks/use-theme";

interface ColorPair {
  foreground: string;
  background: string;
  name: string;
}

interface ContrastResult {
  name: string;
  ratio: number;
  level: "AAA" | "AA" | "Fail";
  percentage: number;
}

interface ContrastReportProps {
  themeName?: string;
  colors?: Record<string, string>;
  locale?: "en" | "ar";
  showDetails?: boolean;
}

/**
 * Contrast Report Dashboard
 * Shows WCAG AA/AAA compliance for theme colors
 */
export function ContrastReport({
  themeName = "Current Theme",
  colors,
  locale = "en",
  showDetails = true,
}: ContrastReportProps) {
  const themeColors = useThemeColors();
  const [expandedPair, setExpandedPair] = useState<string | null>(null);

  const isRTL = locale === "ar";

  const finalColors = useMemo(
    () => (colors || themeColors || {}) as any,
    [colors, themeColors]
  );

  // Common color pairs to test
  const colorPairs: ColorPair[] = useMemo(
    () => [
      {
        foreground: finalColors.text || "#1f2937",
        background: finalColors.background || "#ffffff",
        name: locale === "en" ? "Text on Background" : "النص على الخلفية",
      },
      {
        foreground: finalColors.primary || "#f97316",
        background: finalColors.background || "#ffffff",
        name: locale === "en" ? "Primary on Background" : "الأساسي على الخلفية",
      },
      {
        foreground: "#ffffff",
        background: finalColors.primary || "#f97316",
        name: locale === "en" ? "White on Primary" : "أبيض على الأساسي",
      },
      {
        foreground: finalColors.secondary || "#0ea5e9",
        background: finalColors.background || "#ffffff",
        name:
          locale === "en"
            ? "Secondary on Background"
            : "الثانوي على الخلفية",
      },
      {
        foreground: "#ffffff",
        background: finalColors.secondary || "#0ea5e9",
        name: locale === "en" ? "White on Secondary" : "أبيض على الثانوي",
      },
      {
        foreground: finalColors.accent || "#fbbf24",
        background: finalColors.background || "#ffffff",
        name: locale === "en" ? "Accent on Background" : "التمييز على الخلفية",
      },
      {
        foreground: finalColors.text || "#1f2937",
        background: finalColors.accent || "#fbbf24",
        name:
          locale === "en"
            ? "Text on Accent"
            : "النص على لون التمييز",
      },
      {
        foreground: finalColors.border || "#e5e7eb",
        background: finalColors.background || "#ffffff",
        name:
          locale === "en"
            ? "Border on Background"
            : "الحدود على الخلفية",
      },
    ],
    [finalColors, locale]
  );

  // Calculate contrast ratios and WCAG levels
  const results: ContrastResult[] = useMemo(
    () =>
      colorPairs.map((pair) => {
        const ratio = getContrastRatio(pair.foreground, pair.background);
        let level: "AAA" | "AA" | "Fail" = "Fail";

        if (meetsWCAGAAA(pair.foreground, pair.background)) {
          level = "AAA";
        } else if (meetsWCAGAA(pair.foreground, pair.background)) {
          level = "AA";
        }

        return {
          name: pair.name,
          ratio,
          level,
          percentage: 0,
        };
      }),
    [colorPairs]
  );

  // Calculate compliance summary
  const compliance = useMemo(
    () => ({
      AAA: results.filter((r) => r.level === "AAA").length,
      AA: results.filter((r) => r.level === "AA").length,
      fail: results.filter((r) => r.level === "Fail").length,
    }),
    [results]
  );

  const labels = {
    en: {
      contrastReport: "Contrast Report",
      wcagCompliance: "WCAG Compliance Summary",
      colorPairs: "Color Pairs",
      ratio: "Ratio",
      wcagLevel: "WCAG Level",
      passes: "Passes",
      passingPairs: "Passing Pairs",
      failingPairs: "Failing Pairs",
      meetsAAA: "Meets AAA (7:1)",
      meetsAA: "Meets AA (4.5:1)",
      doesNotMeet: "Does Not Meet",
      sampleText: "Sample Text",
      normal: "Normal Text",
      largeText: "Large Text (18pt+)",
    },
    ar: {
      contrastReport: "تقرير التباين",
      wcagCompliance: "ملخص توافق WCAG",
      colorPairs: "أزواج الألوان",
      ratio: "النسبة",
      wcagLevel: "مستوى WCAG",
      passes: "يمر",
      passingPairs: "الأزواج الناجحة",
      failingPairs: "الأزواج الفاشلة",
      meetsAAA: "يستوفي AAA (7:1)",
      meetsAA: "يستوفي AA (4.5:1)",
      doesNotMeet: "لا يستوفي",
      sampleText: "نص عينة",
      normal: "النص العادي",
      largeText: "النص الكبير (18pt+)",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  const allPassing = compliance.fail === 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: (themeColors as any)?.text || "#1f2937" }}
        >
          {t.contrastReport}
        </h2>
        <p
          className="text-sm"
          style={{ color: `hsl(var(--theme-text) / 0.6)` }}
        >
          {themeName}
        </p>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-3 gap-4">
        {/* AAA Count */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "#f0fdf4",
            borderColor: "#22c55e",
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "#16a34a" }}
          >
            {compliance.AAA}
          </p>
          <p
            className="text-xs"
            style={{ color: "#16a34a" }}
          >
            {t.meetsAAA}
          </p>
        </div>

        {/* AA Count */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "#fef3c7",
            borderColor: "#f59e0b",
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "#d97706" }}
          >
            {compliance.AA}
          </p>
          <p
            className="text-xs"
            style={{ color: "#d97706" }}
          >
            {t.meetsAA}
          </p>
        </div>

        {/* Fail Count */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: compliance.fail === 0 ? "#f0fdf4" : "#fee2e2",
            borderColor: compliance.fail === 0 ? "#22c55e" : "#ef4444",
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{
              color: compliance.fail === 0 ? "#16a34a" : "#dc2626",
            }}
          >
            {compliance.fail}
          </p>
          <p
            className="text-xs"
            style={{
              color: compliance.fail === 0 ? "#16a34a" : "#dc2626",
            }}
          >
            {t.failingPairs}
          </p>
        </div>
      </div>

      {/* Overall Status */}
      <div
        className="p-4 rounded-lg border flex items-start gap-3"
        style={{
          backgroundColor: allPassing ? "#f0fdf4" : "#fee2e2",
          borderColor: allPassing ? "#22c55e" : "#ef4444",
        }}
      >
        {allPassing ? (
          <CheckCircle2
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: "#16a34a" }}
          />
        ) : (
          <AlertCircle
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: "#dc2626" }}
          />
        )}
        <div>
          <h4
            className="font-semibold mb-1"
            style={{
              color: allPassing ? "#16a34a" : "#dc2626",
            }}
          >
            {allPassing
              ? locale === "en"
                ? "All Color Pairs Pass WCAG AA"
                : "جميع أزواج الألوان تستوفي معايير WCAG AA"
              : locale === "en"
                ? "Some Color Pairs Do Not Meet WCAG AA"
                : "بعض أزواج الألوان لا تستوفي معايير WCAG AA"}
          </h4>
          <p
            className="text-sm"
            style={{
              color: allPassing ? "#16a34a" : "#dc2626",
            }}
          >
            {allPassing
              ? locale === "en"
                ? "Your theme meets WCAG AA accessibility standards for all tested color combinations."
                : "يستوفي موضوعك معايير WCAG AA للوصول الشامل لجميع مجموعات الألوان المختبرة."
              : locale === "en"
                ? "Review the color pairs below and adjust colors to meet WCAG AA (4.5:1 contrast ratio)."
                : "راجع أزواج الألوان أدناه واضبط الألوان لاستيفاء معايير WCAG AA (نسبة تباين 4.5:1)."}
          </p>
        </div>
      </div>

      {/* Detailed Results */}
      {showDetails && (
        <div>
          <h3
            className="font-semibold mb-4"
            style={{ color: (themeColors as any)?.text || "#1f2937" }}
          >
            {t.colorPairs}
          </h3>

          <div className="space-y-2">
            {results.map((result, index) => {
              const pair = colorPairs[index];
              const isExpanded = expandedPair === result.name;

              return (
                <div
                  key={result.name}
                  className="border rounded-lg overflow-hidden"
                  style={{
                    borderColor:
                      result.level === "Fail"
                        ? "#ef4444"
                        : result.level === "AA"
                          ? "#f59e0b"
                          : "#22c55e",
                  }}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() =>
                      setExpandedPair(
                        isExpanded ? null : result.name
                      )
                    }
                    className={`w-full p-4 flex items-center justify-between hover:bg-black/5 transition-colors ${
                      isRTL ? "text-right" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {result.level === "Fail" ? (
                        <AlertTriangle
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: "#ef4444" }}
                        />
                      ) : (
                        <CheckCircle2
                          className="h-5 w-5 flex-shrink-0"
                          style={{
                            color:
                              result.level === "AAA"
                                ? "#16a34a"
                                : "#d97706",
                          }}
                        />
                      )}
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p
                          className="font-medium"
                          style={{
                            color: (themeColors as any)?.text || "#1f2937",
                          }}
                        >
                          {result.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: `hsl(var(--theme-text) / 0.5)`,
                          }}
                        >
                          {t.ratio}: {result.ratio.toFixed(2)}:1
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor:
                          result.level === "Fail"
                            ? "#fee2e2"
                            : result.level === "AA"
                              ? "#fef3c7"
                              : "#f0fdf4",
                        color:
                          result.level === "Fail"
                            ? "#dc2626"
                            : result.level === "AA"
                              ? "#d97706"
                              : "#16a34a",
                      }}
                    >
                      {result.level}
                    </span>
                  </button>

                  {/* Details Row */}
                  {isExpanded && pair && (
                    <div
                      className="p-4 border-t space-y-4"
                      style={{
                        backgroundColor: `hsl(var(--theme-background) / 0.3)`,
                        borderTopColor: "currentColor",
                      }}
                    >
                      {/* Sample Text */}
                      <div>
                        <p
                          className="text-xs font-semibold mb-2"
                          style={{
                            color: `hsl(var(--theme-text) / 0.7)`,
                          }}
                        >
                          {t.sampleText}
                        </p>
                        <p
                          className="text-sm mb-2"
                          style={{
                            color: pair.foreground,
                            backgroundColor: pair.background,
                            padding: "12px",
                            borderRadius: "4px",
                          }}
                        >
                          {locale === "en"
                            ? "The quick brown fox jumps over the lazy dog"
                            : "الثعلب البني السريع يقفز فوق الكلب الكسول"}
                        </p>
                      </div>

                      {/* Large Text Sample */}
                      <div>
                        <p
                          className="text-xs font-semibold mb-2"
                          style={{
                            color: `hsl(var(--theme-text) / 0.7)`,
                          }}
                        >
                          {t.largeText}
                        </p>
                        <p
                          className="text-lg mb-2"
                          style={{
                            color: pair.foreground,
                            backgroundColor: pair.background,
                            padding: "12px",
                            borderRadius: "4px",
                          }}
                        >
                          Heading
                        </p>
                      </div>

                      {/* Color Values */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p
                            className="font-semibold mb-1"
                            style={{
                              color: `hsl(var(--theme-text) / 0.7)`,
                            }}
                          >
                            {locale === "en"
                              ? "Foreground"
                              : "الأمام"}
                          </p>
                          <div
                            className="h-8 rounded border"
                            style={{
                              backgroundColor:
                                pair.foreground,
                              borderColor: "currentColor",
                            }}
                          />
                          <p
                            className="mt-1 font-mono"
                            style={{
                              color: `hsl(var(--theme-text) / 0.5)`,
                            }}
                          >
                            {pair.foreground}
                          </p>
                        </div>
                        <div>
                          <p
                            className="font-semibold mb-1"
                            style={{
                              color: `hsl(var(--theme-text) / 0.7)`,
                            }}
                          >
                            {locale === "en"
                              ? "Background"
                              : "الخلفية"}
                          </p>
                          <div
                            className="h-8 rounded border"
                            style={{
                              backgroundColor:
                                pair.background,
                              borderColor: "currentColor",
                            }}
                          />
                          <p
                            className="mt-1 font-mono"
                            style={{
                              color: `hsl(var(--theme-text) / 0.5)`,
                            }}
                          >
                            {pair.background}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
