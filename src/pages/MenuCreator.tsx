import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventMenu } from '@/types/menu';
import { createEmptyMenu } from '@/services/menuCalculationService';
import { EventPlanningFlow } from '@/components/EventPlanningFlow';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowLeft, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveEventMenu } from '@/services/localAdminService';
import { hasAdminSession } from '@/services/adminAccessService';
import './planner.css';

const MenuCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = hasAdminSession();
  const [menu, setMenu] = useState<EventMenu>(() => {
    const saved = localStorage.getItem('currentMenu');
    return saved ? JSON.parse(saved) : createEmptyMenu();
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    localStorage.setItem('currentMenu', JSON.stringify(menu));
  }, [isAdmin, menu]);

  const handleMenuChange = (updatedMenu: EventMenu) => {
    setMenu(updatedMenu);
  };

  const handleSave = () => {
    try {
      saveEventMenu(menu);
      toast({
        title: "Menu Saved",
        description: "Your event menu has been saved to this browser.",
      });
    } catch (error) {
      toast({
        title: "Could not save menu",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="planner-page min-h-screen">
      <nav className="planner-topbar sticky top-0 z-50">
        <div className="planner-topbar-inner">
          <button className="planner-brand" onClick={() => navigate('/')} aria-label="Back to BKR Catering home">
            <BrandLogo />
            <span>Event menu planner</span>
          </button>
          <div className="planner-topbar-actions">
            <ThemeToggle showLabel />
            <Button variant="ghost" onClick={() => navigate('/')} aria-label="Back to home">
              <ArrowLeft className="h-4 w-4" />
              <span>Home</span>
            </Button>
            <Button variant="ghost" onClick={() => navigate('/admin')} aria-label="Open admin dashboard">
              <FileText className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button className="planner-save-button" onClick={handleSave} aria-label="Save event draft">
              <Save className="h-4 w-4" />
              <span>Save draft</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="planner-main">
        <section className="planner-welcome">
          <p className="planner-welcome-kicker">BKR CATERING <span>·</span> EVENT STUDIO</p>
          <h1>Plan a gathering worth remembering.</h1>
          <p>Bring the details, sessions and menu together, then share a polished copy in English or Tamil.</p>
        </section>
        <EventPlanningFlow menu={menu} onMenuChange={handleMenuChange} />
      </main>
    </div>
  );
};

export default MenuCreator;
