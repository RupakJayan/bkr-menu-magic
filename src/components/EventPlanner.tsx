import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Download, 
  Share2,
  Plus,
  Minus,
  Edit3,
  Trash2
} from 'lucide-react';
import { 
  eventSessions, 
  categoryMapping, 
  defaultHeadCounts,
  type Session,
  type SessionSelection 
} from '../data/eventMenuData';
import { menuData } from '../data/menuData';
import jsPDF from 'jspdf';

interface EventPlannerProps {
  language: 'en' | 'ta';
}

const EventPlanner: React.FC<EventPlannerProps> = ({ language }) => {
  const [selectedSessions, setSelectedSessions] = useState<SessionSelection[]>([]);
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [activeTab, setActiveTab] = useState('planning');

  // Initialize sessions with default values
  useEffect(() => {
    const initialSessions = eventSessions.map(session => ({
      sessionId: session.id,
      items: [],
      headCount: defaultHeadCounts[session.id as keyof typeof defaultHeadCounts] || 25,
      timing: session.time
    }));
    setSelectedSessions(initialSessions);
  }, []);

  const addItemToSession = (sessionId: string, itemId: string) => {
    setSelectedSessions(prev => prev.map(session => {
      if (session.sessionId === sessionId) {
        const existingItem = session.items.find(item => item.itemId === itemId);
        if (existingItem) {
          return {
            ...session,
            items: session.items.map(item => 
              item.itemId === itemId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        } else {
          return {
            ...session,
            items: [...session.items, { itemId, quantity: 1 }]
          };
        }
      }
      return session;
    }));
  };

  const removeItemFromSession = (sessionId: string, itemId: string) => {
    setSelectedSessions(prev => prev.map(session => {
      if (session.sessionId === sessionId) {
        const existingItem = session.items.find(item => item.itemId === itemId);
        if (existingItem && existingItem.quantity > 1) {
          return {
            ...session,
            items: session.items.map(item => 
              item.itemId === itemId 
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          };
        } else {
          return {
            ...session,
            items: session.items.filter(item => item.itemId !== itemId)
          };
        }
      }
      return session;
    }));
  };

  const updateHeadCount = (sessionId: string, count: number) => {
    setSelectedSessions(prev => prev.map(session => 
      session.sessionId === sessionId 
        ? { ...session, headCount: Math.max(1, count) }
        : session
    ));
  };

  const updateTiming = (sessionId: string, timing: string) => {
    setSelectedSessions(prev => prev.map(session => 
      session.sessionId === sessionId 
        ? { ...session, timing }
        : session
    ));
  };

  const getSessionItems = (sessionId: string) => {
    const session = selectedSessions.find(s => s.sessionId === sessionId);
    return session?.items || [];
  };

  const getItemDetails = (itemId: string) => {
    for (const category of Object.values(menuData)) {
      const item = category.find(i => i.id === itemId);
      if (item) return item;
    }
    return null;
  };

  const generateStructuredMenu = () => {
    let menu = '';
    
    selectedSessions.forEach(session => {
      if (session.items.length > 0) {
        const sessionInfo = eventSessions.find(s => s.id === session.sessionId);
        const sessionName = language === 'en' ? sessionInfo?.name_en : sessionInfo?.name_ta;
        const time = session.timing;
        const headCount = session.headCount;
        
        menu += `${sessionName} @ ${time} – NOS: ${headCount}\n\n`;
        
        // Group items by category
        const categorizedItems: { [key: string]: string[] } = {};
        
        session.items.forEach(selectedItem => {
          const item = getItemDetails(selectedItem.itemId);
          if (item) {
            // Find the category by searching through menuData
            let itemCategory = '';
            for (const [catName, catItems] of Object.entries(menuData)) {
              if (catItems.find(catItem => catItem.id === selectedItem.itemId)) {
                itemCategory = catName;
                break;
              }
            }
            
            if (!categorizedItems[itemCategory]) {
              categorizedItems[itemCategory] = [];
            }
            const itemName = language === 'en' ? item.name_en : item.name_ta;
            categorizedItems[itemCategory].push(itemName);
          }
        });
        
        // Output categorized items
        Object.entries(categorizedItems).forEach(([category, items]) => {
          if (items.length > 0) {
            menu += `${category}: ${items.join(', ')}\n`;
          }
        });
        
        menu += '\n';
      }
    });
    
    return menu;
  };

  const exportMenu = () => {
    const menu = generateStructuredMenu();
    const blob = new Blob([menu], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-menu-${eventDate || 'planning'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(language === 'en' ? 'Event Menu Plan' : 'நிகழ்வு மெனு திட்டம்', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Event details
    if (eventName || eventDate) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      if (eventName) {
        doc.text(`${language === 'en' ? 'Event: ' : 'நிகழ்வு: '}${eventName}`, margin, yPosition);
        yPosition += 10;
      }
      if (eventDate) {
        doc.text(`${language === 'en' ? 'Date: ' : 'தேதி: '}${eventDate}`, margin, yPosition);
        yPosition += 15;
      }
    }

    // Menu content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    selectedSessions.forEach(session => {
      if (session.items.length > 0) {
        const sessionInfo = eventSessions.find(s => s.id === session.sessionId);
        const sessionName = language === 'en' ? sessionInfo?.name_en : sessionInfo?.name_ta;
        const time = session.timing;
        const headCount = session.headCount;
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Session header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${sessionName} @ ${time} – NOS: ${headCount}`, margin, yPosition);
        yPosition += 8;
        
        // Group items by category
        const categorizedItems: { [key: string]: string[] } = {};
        
        session.items.forEach(selectedItem => {
          const item = getItemDetails(selectedItem.itemId);
          if (item) {
            // Find the category by searching through menuData
            let itemCategory = '';
            for (const [catName, catItems] of Object.entries(menuData)) {
              if (catItems.find(catItem => catItem.id === selectedItem.itemId)) {
                itemCategory = catName;
                break;
              }
            }
            
            if (!categorizedItems[itemCategory]) {
              categorizedItems[itemCategory] = [];
            }
            const itemName = language === 'en' ? item.name_en : item.name_ta;
            categorizedItems[itemCategory].push(itemName);
          }
        });
        
        // Output categorized items
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        Object.entries(categorizedItems).forEach(([category, items]) => {
          if (items.length > 0) {
            if (yPosition > 250) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(`${category}: ${items.join(', ')}`, margin + 5, yPosition);
            yPosition += 6;
          }
        });
        
        yPosition += 10;
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated by BKR Catering - ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: 'center' });

    // Save the PDF
    doc.save(`event-menu-${eventDate || 'planning'}.pdf`);
  };

  const shareMenu = () => {
    const menu = generateStructuredMenu();
    if (navigator.share) {
      navigator.share({
        title: language === 'en' ? 'Event Menu Plan' : 'நிகழ்வு மெனு திட்டம்',
        text: menu,
      });
    } else {
      navigator.clipboard.writeText(menu);
      alert(language === 'en' ? 'Menu copied to clipboard!' : 'மெனு கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {language === 'en' ? 'Event Menu Planner' : 'நிகழ்வு மெனு திட்டமிடுநர்'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {language === 'en' 
            ? 'Plan your complete event menu with session-based organization'
            : 'அமர்வு அடிப்படையிலான அமைப்புடன் உங்கள் முழு நிகழ்வு மெனுவைத் திட்டமிடுங்கள்'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planning">
            {language === 'en' ? 'Menu Planning' : 'மெனு திட்டமிடல்'}
          </TabsTrigger>
          <TabsTrigger value="overview">
            {language === 'en' ? 'Menu Overview' : 'மெனு கண்ணோட்டம்'}
          </TabsTrigger>
          <TabsTrigger value="export">
            {language === 'en' ? 'Export & Share' : 'ஏற்றுமதி & பகிர்'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {language === 'en' ? 'Event Details' : 'நிகழ்வு விவரங்கள்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventName">
                    {language === 'en' ? 'Event Name' : 'நிகழ்வு பெயர்'}
                  </Label>
                  <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder={language === 'en' ? 'Enter event name' : 'நிகழ்வு பெயரை உள்ளிடவும்'}
                  />
                </div>
                <div>
                  <Label htmlFor="eventDate">
                    {language === 'en' ? 'Event Date' : 'நிகழ்வு தேதி'}
                  </Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session-based Menu Selection */}
          <div className="space-y-6">
            {eventSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{language === 'en' ? session.name_en : session.name_ta}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`timing-${session.id}`}>
                          {language === 'en' ? 'Time:' : 'நேரம்:'}
                        </Label>
                        <Input
                          id={`timing-${session.id}`}
                          value={selectedSessions.find(s => s.sessionId === session.id)?.timing || session.time}
                          onChange={(e) => updateTiming(session.id, e.target.value)}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <Label htmlFor={`headcount-${session.id}`}>
                          {language === 'en' ? 'Head Count:' : 'தலை எண்ணிக்கை:'}
                        </Label>
                        <Input
                          id={`headcount-${session.id}`}
                          type="number"
                          min="1"
                          value={selectedSessions.find(s => s.sessionId === session.id)?.headCount || 25}
                          onChange={(e) => updateHeadCount(session.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(categoryMapping).map(([categoryName, menuCategories]) => {
                      const availableItems = menuCategories.flatMap(cat => 
                        menuData[cat as keyof typeof menuData] || []
                      );
                      
                      if (availableItems.length === 0) return null;
                      
                      return (
                        <AccordionItem key={categoryName} value={categoryName}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-medium">{categoryName}</span>
                              <Badge variant="secondary">
                                {availableItems.length} {language === 'en' ? 'items' : 'பொருட்கள்'}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                              {availableItems.map((item) => {
                                const isSelected = getSessionItems(session.id).some(
                                  selected => selected.itemId === item.id
                                );
                                const selectedItem = getSessionItems(session.id).find(
                                  selected => selected.itemId === item.id
                                );
                                
                                return (
                                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            addItemToSession(session.id, item.id);
                                          } else {
                                            removeItemFromSession(session.id, item.id);
                                          }
                                        }}
                                      />
                                      <div>
                                        <p className="font-medium text-sm">
                                          {language === 'en' ? item.name_en : item.name_ta}
                                        </p>
                                        {language === 'ta' && (
                                          <p className="text-xs text-muted-foreground">{item.name_en}</p>
                                        )}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => removeItemFromSession(session.id, item.id)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-sm font-medium min-w-[20px] text-center">
                                          {selectedItem?.quantity || 1}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => addItemToSession(session.id, item.id)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {language === 'en' ? 'Complete Menu Overview' : 'முழு மெனு கண்ணோட்டம்'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSessions.map((session) => {
                const sessionInfo = eventSessions.find(s => s.id === session.sessionId);
                const sessionName = language === 'en' ? sessionInfo?.name_en : sessionInfo?.name_ta;
                const items = getSessionItems(session.sessionId);
                
                if (items.length === 0) return null;
                
                return (
                  <div key={session.sessionId} className="mb-6 p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-foreground">
                        {sessionName} @ {session.timing} – NOS: {session.headCount}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(categoryMapping).map(([categoryName, menuCategories]) => {
                        const categoryItems = items.filter(selectedItem => {
                          const item = getItemDetails(selectedItem.itemId);
                          if (!item) return false;
                          
                          // Find the category by searching through menuData
                          for (const [catName, catItems] of Object.entries(menuData)) {
                            if (catItems.find(catItem => catItem.id === selectedItem.itemId)) {
                              return menuCategories.includes(catName);
                            }
                          }
                          return false;
                        });
                        
                        if (categoryItems.length === 0) return null;
                        
                        return (
                          <div key={categoryName} className="ml-4">
                            <span className="font-medium text-foreground">{categoryName}: </span>
                            <span className="text-muted-foreground">
                              {categoryItems.map(selectedItem => {
                                const item = getItemDetails(selectedItem.itemId);
                                const itemName = language === 'en' ? item?.name_en : item?.name_ta;
                                return itemName;
                              }).join(', ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {selectedSessions.every(session => session.items.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  {language === 'en' 
                    ? 'No items selected yet. Go to Menu Planning to start building your event menu.'
                    : 'இன்னும் எந்த பொருட்களும் தேர்ந்தெடுக்கப்படவில்லை. உங்கள் நிகழ்வு மெனுவை உருவாக்கத் தொடங்க மெனு திட்டமிடலுக்குச் செல்லுங்கள்.'
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                {language === 'en' ? 'Export & Share Menu' : 'மெனுவை ஏற்றுமதி செய்து பகிரவும்'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={exportPDF} 
                  className="w-full"
                  disabled={selectedSessions.every(session => session.items.length === 0)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Download as PDF' : 'PDF ஆக பதிவிறக்கவும்'}
                </Button>
                
                <Button 
                  onClick={exportMenu} 
                  variant="outline"
                  className="w-full"
                  disabled={selectedSessions.every(session => session.items.length === 0)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Download as Text File' : 'உரை கோப்பாக பதிவிறக்கவும்'}
                </Button>
                
                <Button 
                  onClick={shareMenu} 
                  variant="outline" 
                  className="w-full"
                  disabled={selectedSessions.every(session => session.items.length === 0)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Share Menu' : 'மெனுவை பகிரவும்'}
                </Button>
              </div>
              
              {selectedSessions.some(session => session.items.length > 0) && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">
                    {language === 'en' ? 'Preview:' : 'முன்னோட்டம்:'}
                  </h4>
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {generateStructuredMenu()}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventPlanner;