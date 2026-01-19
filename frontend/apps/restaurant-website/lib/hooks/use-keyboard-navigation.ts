"use client";

import { useEffect, useRef, useState } from "react";

export interface KeyboardNavOptions {
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: (shiftKey: boolean) => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation support
 * Handles arrow keys, Enter, Escape, and Tab
 *
 * @example
 * const { activeIndex, setActiveIndex } = useKeyboardNavigation({
 *   onArrowDown: () => setActiveIndex(prev => prev + 1),
 *   onArrowUp: () => setActiveIndex(prev => prev - 1),
 * })
 */
export function useKeyboardNavigation(options: KeyboardNavOptions) {
  const {
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onTab,
    enabled = true,
  } = options;

  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onArrowUp?.();
          break;

        case "ArrowDown":
          event.preventDefault();
          onArrowDown?.();
          break;

        case "ArrowLeft":
          event.preventDefault();
          onArrowLeft?.();
          break;

        case "ArrowRight":
          event.preventDefault();
          onArrowRight?.();
          break;

        case "Enter":
          event.preventDefault();
          onEnter?.();
          break;

        case "Escape":
          event.preventDefault();
          onEscape?.();
          break;

        case "Tab":
          event.preventDefault();
          onTab?.(event.shiftKey);
          break;

        default:
          break;
      }
    };

    // Listen for focus events on the container
    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      container.addEventListener("focus", handleFocus, true);
      container.addEventListener("blur", handleBlur, true);
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
        container.removeEventListener("focus", handleFocus, true);
        container.removeEventListener("blur", handleBlur, true);
      }
    };
  }, [
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEnter,
    onEscape,
    onTab,
    enabled,
  ]);

  return { containerRef, isActive };
}

/**
 * Hook to manage focus within a list of items
 * Automatically handles arrow key navigation
 *
 * @example
 * const { focusIndex, setFocusIndex, getFocusProps } = useFocusManagement(items.length)
 */
export function useFocusManagement(itemCount: number) {
  const [focusIndex, setFocusIndex] = useState(0);
  const itemsRef = useRef<HTMLElement[]>([]);

  const moveFocus = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, itemCount - 1));
    setFocusIndex(newIndex);

    // Focus the element asynchronously
    setTimeout(() => {
      itemsRef.current[newIndex]?.focus();
    }, 0);
  };

  const { containerRef } = useKeyboardNavigation({
    onArrowDown: () => moveFocus(focusIndex + 1),
    onArrowUp: () => moveFocus(focusIndex - 1),
    onArrowRight: () => moveFocus(focusIndex + 1),
    onArrowLeft: () => moveFocus(focusIndex - 1),
  });

  const getFocusProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      if (el) {
        itemsRef.current[index] = el;
      }
    },
    tabIndex: focusIndex === index ? 0 : -1,
    onFocus: () => setFocusIndex(index),
  });

  return { focusIndex, setFocusIndex, containerRef, getFocusProps, moveFocus };
}

/**
 * Hook to handle skip links for keyboard navigation
 * Creates accessible skip links to main content
 *
 * @example
 * useSkipLink()
 * // Then add in HTML:
 * // <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
 * // <main id="main-content">...</main>
 */
export function useSkipLink(selector = "#main-content") {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + 0 or Cmd + 0 triggers skip link
      if ((event.altKey || event.metaKey) && event.key === "0") {
        event.preventDefault();
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selector]);
}

/**
 * Hook to detect keyboard-only navigation
 * Useful for showing focus indicators only for keyboard users
 */
export function useKeyboardOnly() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => {
      setIsKeyboardUser(true);
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchstart", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchstart", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
}

/**
 * Hook to manage menu/dropdown keyboard navigation
 * Handles opening/closing with arrow keys and Enter
 */
export function useMenuKeyboard(isOpen: boolean, onOpen: () => void, onClose: () => void) {
  const { containerRef } = useKeyboardNavigation({
    onArrowDown: isOpen ? undefined : onOpen,
    onArrowUp: isOpen ? undefined : onOpen,
    onEscape: onClose,
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        onClose();
      } else {
        onOpen();
      }
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  return { containerRef, handleKeyDown };
}
