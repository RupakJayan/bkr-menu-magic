import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventMenu } from '@/types/menu';
import { createEmptyMenu } from '@/services/menuCalculationService';
import { EventPlanningFlow } from '@/components/EventPlanningFlow';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowLeft, Check, CloudOff, Download, FileText, PlusCircle, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportMenuJSON, saveEventMenu } from '@/services/localAdminService';
import { hasAdminSession } from '@/services/adminAccessService';
import { getStoredGoogleToken, requestGoogleLogin } from '@/services/googleAuthService';
import { isGoogleAuthExpiredError, saveMenuDataToDrive, saveMenuToGoogleDrive } from '@/services/googleDriveService';
import { AiMenuLensDialog } from '@/components/ai/AiMenuLensDialog';
import './planner.css';

const MenuCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = hasAdminSession();
  const [aiLensOpen, setAiLensOpen] = useState(false);
  const [driveAuthExpired, setDriveAuthExpired] = useState(false);
  const [menu, setMenu] = useState<EventMenu>(() => {
    const saved = localStorage.getItem('currentMenu');
    return saved ? JSON.parse(saved) : createEmptyMenu();
  });

  const handleCreateNew = () => {
    try {
      localStorage.removeItem('currentMenu');
    } catch {}
    const fresh = createEmptyMenu();
    setMenu(fresh);
    toast({
      title: "Started New Blank Event",
      description: "All previous details cleared. You are ready to plan a fresh event.",
    });
  };

  const handleReconnectDrive = async () => {
    try {
      const newToken = await requestGoogleLogin();
      if (newToken) {
        setDriveAuthExpired(false);
        await saveMenuDataToDrive(menu, newToken);
        toast({
          title: "Google Drive Reconnected! ☁️",
          description: "All existing menu data backed up safely to Google Drive.",
        });
      }
    } catch (e: any) {
      toast({
        title: "Connection Failed",
        description: e?.message || "Could not sign in to Google Drive. Local data is completely safe.",
        variant: "destructive",
      });
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    localStorage.setItem('currentMenu', JSON.stringify(menu));

    // Auto-sync into saved events list if client name, venue, or sessions exist
    if (
      menu.clientDetails.name.trim() ||
      menu.venueDetails.name.trim() ||
      menu.days.length > 0
    ) {
      saveEventMenu(menu);
      setAutoSaved(true);
      const timer = setTimeout(() => setAutoSaved(false), 2500);

      // Debounce fast background Google Drive sync (2.5 seconds idle)
      const token = getStoredGoogleToken();
      let driveSyncTimer: ReturnType<typeof setTimeout> | undefined;
      if (token) {
        driveSyncTimer = setTimeout(() => {
          saveMenuDataToDrive(menu, token)
            .then(() => setDriveAuthExpired(false))
            .catch((err) => {
              if (isGoogleAuthExpiredError(err)) {
                setDriveAuthExpired(true);
              }
            });
        }, 2500);
      }

      return () => {
        clearTimeout(timer);
        if (driveSyncTimer) clearTimeout(driveSyncTimer);
      };
    }
  }, [isAdmin, menu]);

  const handleMenuChange = (updatedMenu: EventMenu) => {
    setMenu(updatedMenu);
  };

  const handleSave = () => {
    try {
      // Local preservation first and foremost - 100% resilient
      saveEventMenu(menu);
      const token = getStoredGoogleToken();
      if (token) {
        saveMenuDataToDrive(menu, token)
          .then(() => {
            setDriveAuthExpired(false);
            toast({
              title: "Menu Synced to Google Drive",
              description: "Saved to 'BKR Catering Events' in Google Drive.",
            });
          })
          .catch((err) => {
            if (isGoogleAuthExpiredError(err)) {
              setDriveAuthExpired(true);
              toast({
                title: "Google Drive Session Expired (Code 401)",
                description: "Your menu & custom items are safely saved on this device. Reconnect anytime to resume cloud backups.",
              });
            }
          });
      }
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
            {driveAuthExpired && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReconnectDrive}
                className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 font-medium text-xs flex items-center gap-1.5 shadow-sm animate-pulse"
                aria-label="Reconnect Google Drive session"
                title="Google Drive session expired (Code 401). All your menu items & details are safe locally. Click to reconnect."
              >
                <CloudOff className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Reconnect Drive</span>
              </Button>
            )}
            {autoSaved && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-fade-in">
                <Check className="h-3 w-3" /> Auto-saved
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiLensOpen(true)}
              className="border-acc/40 bg-acc/10 hover:bg-acc/15 text-acc dark:text-acc font-semibold shadow-theme-sm flex items-center gap-1.5 transition-colors"
              aria-label="Scan handwritten menu using AI Lens"
              title="Scan photo of handwritten catering notes with AI"
            >
              <Sparkles className="h-3.5 w-3.5 text-acc shrink-0" />
              <span>AI Menu Lens</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateNew}
              className="border-rose-300 text-rose-700 hover:bg-rose-50 font-medium"
              aria-label="Create new blank event"
              title="Clear all fields and plan a fresh blank event"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>New event</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportMenuJSON(menu)}
              aria-label="Download menu backup file"
              title="Download menu backup file (.json)"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Backup</span>
            </Button>
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
        <EventPlanningFlow
          key={menu.id}
          menu={menu}
          onMenuChange={handleMenuChange}
          onStartNewEvent={handleCreateNew}
          onOpenAiLens={() => setAiLensOpen(true)}
        />
      </main>

      <AiMenuLensDialog
        open={aiLensOpen}
        onOpenChange={setAiLensOpen}
        onMenuLoaded={(loadedMenu) => {
          setMenu(loadedMenu);
        }}
        currentMenu={menu}
      />
    </div>
  );
};

export default MenuCreator;
