"use client";

import { TamboProvider as TamboAIProvider, type TamboTool } from "@tambo-ai/react";

interface TamboProviderProps {
  children: React.ReactNode;
  tools?: TamboTool[];
}

export function TamboProvider({ children, tools }: TamboProviderProps) {
  return (
    <TamboAIProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      environment={process.env.NODE_ENV === "production" ? "production" : "staging"}
      tools={tools}
    >
      {children}
    </TamboAIProvider>
  );
}
