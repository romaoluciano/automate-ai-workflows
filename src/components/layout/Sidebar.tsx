
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChartBarIcon, 
  BoltIcon, 
  Cog6ToothIcon, 
  ShoppingBagIcon, 
  HomeIcon, 
  ClipboardDocumentCheckIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ElementType;
  href: string;
  label: string;
  active: boolean;
};

const SidebarItem = ({ icon: Icon, href, label, active }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary-500",
        active ? "bg-primary-100 text-primary-600" : "text-gray-600 hover:bg-primary-50"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    { icon: HomeIcon, href: "/", label: "Dashboard", id: "dashboard" },
    { icon: ClipboardDocumentCheckIcon, href: "/diagnostico", label: "Diagnóstico", id: "diagnostico" },
    { icon: BoltIcon, href: "/automacoes", label: "Automações", id: "automacoes" },
    { icon: ShoppingBagIcon, href: "/marketplace", label: "Marketplace", id: "marketplace" },
    { icon: ChartBarIcon, href: "/relatorios", label: "Relatórios", id: "relatorios" },
    { icon: Cog6ToothIcon, href: "/configuracoes", label: "Configurações", id: "configuracoes" },
    { icon: UserIcon, href: "/conta", label: "Conta", id: "conta" },
  ];

  return (
    <aside
      className={cn(
        "bg-sidebar relative flex flex-col border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <BoltIcon className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-primary-700">AutomateAI</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="flex items-center justify-center w-full">
            <BoltIcon className="h-8 w-8 text-primary-500" />
          </Link>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full p-1 hover:bg-gray-100 lg:block"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <Bars3Icon className="h-5 w-5" />
          ) : (
            <XMarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              href={item.href}
              label={item.label}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        {!collapsed && (
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground">
              AutomateAI v1.0.0
            </p>
            <p className="text-xs text-muted-foreground">
              Plano: Business
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
