import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

describe('LanguageSwitcher Component', () => {
  const mockPush = jest.fn();
  const mockStartTransition = jest.fn((callback) => callback());

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/en/menu');
    (useLocale as jest.Mock).mockReturnValue('en');
    React.useTransition = jest.fn(() => [false, mockStartTransition]);
  });

  test('renders language switcher button with globe icon', () => {
    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  test('displays current locale (EN)', () => {
    (useLocale as jest.Mock).mockReturnValue('en');
    render(<LanguageSwitcher />);
    expect(screen.getByText('en')).toBeInTheDocument();
  });

  test('displays current locale (AR)', () => {
    (useLocale as jest.Mock).mockReturnValue('ar');
    render(<LanguageSwitcher />);
    expect(screen.getByText('ar')).toBeInTheDocument();
  });

  test('toggles language from EN to AR', () => {
    (useLocale as jest.Mock).mockReturnValue('en');
    (usePathname as jest.Mock).mockReturnValue('/en/menu');
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/ar/menu');
  });

  test('toggles language from AR to EN', () => {
    (useLocale as jest.Mock).mockReturnValue('ar');
    (usePathname as jest.Mock).mockReturnValue('/ar/menu');
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/en/menu');
  });

  test('saves language preference to localStorage', () => {
    (useLocale as jest.Mock).mockReturnValue('en');
    const localStorageMock = jest.spyOn(window.localStorage, 'setItem');

    render(<LanguageSwitcher />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(localStorageMock).toHaveBeenCalledWith('preferred-language', 'ar');
    localStorageMock.mockRestore();
  });

  test('has correct aria-label for accessibility', () => {
    (useLocale as jest.Mock).mockReturnValue('en');
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to Arabic');
  });

  test('has correct title attribute', () => {
    (useLocale as jest.Mock).mockReturnValue('en');
    render(<LanguageSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'عربي');
  });
});
