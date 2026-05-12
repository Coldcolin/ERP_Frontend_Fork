import type { Metadata } from "next";
import MainRoot from "./_components/layout/MainRoot";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Package,
  DollarSign
} from 'lucide-react';

interface Navigation {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navigations: Navigation[] = [
  {
    href: '/logistics',
    icon: <LayoutDashboard color="black" size={20} />,
    label: 'Overview',
  },
  {
    href: '/logistics/order-management',
    icon: <ClipboardList color="black" size={20} />,
    label: 'Order Management',
  },
  {
    href: '/logistics/fleet-preparation',
    icon: <Truck color="black" size={20} />,
    label: 'Fleet Preparation',
  },
  {
    href: '/logistics/delivery-execution',
    icon: <Package color="black" size={20} />,
    label: 'Delivery Execution',
  },
  {
    href: '/logistics/expenses-revenue',
    icon: <DollarSign color="black" size={20} />,
    label: 'Expenses & Revenue',
  },
];

export const metadata: Metadata = {
  title: "Dreamworks Logistics - Operations",
  description: "Logistics and road operations dashboard",
};

export default function LogisticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {   
  return (
    <MainRoot navigation={navigations}>
      {children}
    </MainRoot>
  );
}
