/**
 * Dashboard Layout
 * Root layout for dashboard pages
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leads Dashboard | Innovation Development Solutions',
  description: 'Track and manage your incoming leads from the Innovation Development Solutions website.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
