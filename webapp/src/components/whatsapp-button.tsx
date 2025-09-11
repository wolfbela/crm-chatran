"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { COMMUNICATION_ROUTES } from "@/lib/constants";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  personName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function WhatsAppButton({
  phoneNumber,
  personName,
  className = "",
  size = "sm"
}: WhatsAppButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const searchParams = new URLSearchParams();
    if (phoneNumber) {
      searchParams.set("phone", phoneNumber);
    }
    if (personName) {
      searchParams.set("contact", personName);
    }

    const url = `${COMMUNICATION_ROUTES.WHATSAPP}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    router.push(url);
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-xs";
      case "lg":
        return "h-12 px-6 text-base";
      default:
        return "h-10 px-4 text-sm";
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${getSizeClasses()} ${className}`}
      variant="default"
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
  );
}
