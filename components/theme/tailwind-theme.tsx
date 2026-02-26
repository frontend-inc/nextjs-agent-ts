"use client";

import React, { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  bgColor?: string;
  fontHeader?: string;
  fontBody?: string;
  disableBorderRadius?: boolean;
}

const loadGoogleFont = (fontName: string): void => {
  const fontFamily = encodeURIComponent(fontName);
  const linkId = `google-font-${fontName.replace(/\s+/g, '-')}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  }
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  primaryColor,
  secondaryColor,
  bgColor,
  fontHeader,
  fontBody,
  disableBorderRadius,
}) => {
  useEffect(() => {
    const root = document.documentElement;

    if (primaryColor) {
      root.style.setProperty("--primary", primaryColor);
    }

    if (secondaryColor) {
      root.style.setProperty("--secondary", secondaryColor);
    }

    if (bgColor) {
      root.style.setProperty("--background", bgColor);
    }

    if (fontHeader) {
      loadGoogleFont(fontHeader);
      root.style.setProperty("--font-header", `"${fontHeader}", system-ui, -apple-system, sans-serif`);
    }

    if (fontBody) {
      loadGoogleFont(fontBody);
      root.style.setProperty("--font-body", `"${fontBody}", system-ui, -apple-system, sans-serif`);
    }

    if (disableBorderRadius) {
      document.body.classList.add('disable-border-radius');
    } else {
      document.body.classList.remove('disable-border-radius');
    }

    return () => {
      if (primaryColor) root.style.removeProperty("--primary");
      if (secondaryColor) root.style.removeProperty("--secondary");
      if (bgColor) root.style.removeProperty("--background");
      if (fontHeader) root.style.removeProperty("--font-header");
      if (fontBody) root.style.removeProperty("--font-body");
      document.body.classList.remove('disable-border-radius');
    };
  }, [primaryColor, secondaryColor, bgColor, fontHeader, fontBody, disableBorderRadius]);

  return <>{children}</>;
};
