import React from 'react';
import { LayoutProps } from "@/widgets/layouts/types";
import { Header } from "@/widgets/header/view";

export const WithHeaderLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header/>
      <main>{children}</main>
    </>
  );
};
