"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import {
  Home,
  Users,
  Calendar,
  MessageSquare,
  Mail,
  Instagram,
  Twitter,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  NAVIGATION_ROUTES,
  NAVIGATION_LABELS,
  COMMUNICATION_ROUTES,
  COMMUNICATION_LABELS,
} from "@/lib/constants";
import { getCurrentUser, logoutUser } from "@/lib/auth-actions";
import { toast } from "sonner";

const navigationItems = [
  {
    title: NAVIGATION_LABELS[NAVIGATION_ROUTES.HOME],
    url: NAVIGATION_ROUTES.HOME,
    icon: Home,
  },
  {
    title: NAVIGATION_LABELS[NAVIGATION_ROUTES.PERSONNES],
    url: NAVIGATION_ROUTES.PERSONNES,
    icon: Users,
  },
  {
    title: NAVIGATION_LABELS[NAVIGATION_ROUTES.MEETINGS],
    url: NAVIGATION_ROUTES.MEETINGS,
    icon: Calendar,
  },
];

const communicationItems = [
  {
    title: COMMUNICATION_LABELS[COMMUNICATION_ROUTES.WHATSAPP],
    url: COMMUNICATION_ROUTES.WHATSAPP,
    icon: MessageSquare,
  },
  {
    title: COMMUNICATION_LABELS[COMMUNICATION_ROUTES.MAIL],
    url: COMMUNICATION_ROUTES.MAIL,
    icon: Mail,
  },
  {
    title: COMMUNICATION_LABELS[COMMUNICATION_ROUTES.INSTAGRAM],
    url: COMMUNICATION_ROUTES.INSTAGRAM,
    icon: Instagram,
  },
  {
    title: COMMUNICATION_LABELS[COMMUNICATION_ROUTES.TWITTER],
    url: COMMUNICATION_ROUTES.TWITTER,
    icon: Twitter,
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    confirmed: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        // Error fetching user - user will remain null
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Show loading or don't show sidebar for auth pages
  if (isLoading || pathname.startsWith("/auth")) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Communication</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {communicationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-1">
            {user && (
              <div className="text-xs text-muted-foreground mb-2">
                {user.email}
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          {user && (
            <>
              <div className="text-sm text-muted-foreground">
                Connecté en tant que {user.email}
              </div>
              <div className="border-l border-border h-8 mx-2" />
              <LogoutButton />
            </>
          )}
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
