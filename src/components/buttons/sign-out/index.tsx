"use client";

import { LogOut } from "lucide-react";
import { LiquidGlassButton } from "@/components/buttons/liquid-glass";
import { useAuth } from "@/hooks/use-auth";

export const SignOutButton = () => {
  const { handleSignOut } = useAuth();

  return (
    <LiquidGlassButton
      onClick={handleSignOut}
      size="lg"
      variant="default"
      className="rounded-full h-12 w-12 flex items-center justify-center">
      <LogOut size={16} />
    </LiquidGlassButton>
  );
};
