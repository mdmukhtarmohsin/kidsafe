"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface RouteBodyProps {
  children: React.ReactNode;
  defaultClassName: string;
  rootClassName: string;
}

export function RouteBody({
  children,
  defaultClassName,
  rootClassName,
}: RouteBodyProps) {
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  return (
    <body className={isRootPath ? rootClassName : defaultClassName}>
      {children}
    </body>
  );
}
