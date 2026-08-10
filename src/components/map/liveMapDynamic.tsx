"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";

/** Client-only Mapbox map (never server-rendered — it needs window). */
export const LiveMapDynamic = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#e7e0d0]" />,
});

/** If the live map throws (bad token, offline), show the styled fallback. */
export class MapErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
