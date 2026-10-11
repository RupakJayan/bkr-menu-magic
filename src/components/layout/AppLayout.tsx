import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  Users, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  FileText,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Create Booking', href: '/', icon: UtensilsCrossed, badge: null },
  { name: 'Calendar', href: '/admin/calendar', icon: Calendar, badge: '3' },
  { name: 'Bookings', href: '/admin/bookings', icon: ClipboardList, badge: '12' },
  { name: 'Customers', href: '/admin/customers', icon: Users, badge: null },
  { name: 'Menu Management', href: '/admin/menu', icon: FileText, badge: null },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, badge: null },
  { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="flex ml-2 md:mr-24">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
                  🍛 BKR Catering
                </span>
              </Link>
            </div>
            
            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search bookings, customers, menu items..."
                  className="pl-10 w-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@bkr.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-3 rounded-lg group transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 transition duration-75 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'
                    }`} />
                    <span className="ml-3 flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Section at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="p-4 lg:ml-64 mt-14">
        <div className="rounded-lg">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};
