import React, { ReactNode } from 'react';
import { LayoutProps } from "@/widgets/layouts/types";

export const BlankLayout = ({ children }: LayoutProps) => {
  return (
    <main>
      {children}
    </main>
  );
};
