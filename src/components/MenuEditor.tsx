import React, { useState, useCallback } from 'react';
import { EventMenu, MenuItem } from '@/types/menu';
import { calculateMenuSummary, updateMenuItem, removeMenuItem, addMenuItem } from '@/services/menuCalculationService';
import { generateMenuPDF } from '@/services/pdfExportService';
import { menuData } from '@/data/menuData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Download } from 'lucide-react';

interface MenuEditorProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
}

const SESSION_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'custom', label: 'Custom' },
];

export const MenuEditor: React.FC<MenuEditorProps> = ({ menu, onMenuChange }) => {
  const [newItem, setNewItem] = useState({
    category: Object.keys(menuData)[0],
    itemId: '',
    quantity: 1,
  });

  const summary = calculateMenuSummary(menu);
  const categories = Object.keys(menuData) as Array<keyof typeof menuData>;
  const currentCategoryItems = menuData[newItem.category as keyof typeof menuData] || [];

  const handleVenueChange = useCallback((venueName: string) => {
    onMenuChange({ ...menu, venueName, updatedAt: new Date() });
  }, [menu, onMenuChange]);

  const handleSessionChange = useCallback((sessionType: string) => {
    const session = SESSION_TYPES.find(s => s.value === sessionType);
    onMenuChange({
      ...menu,
      sessionType: sessionType as EventMenu['sessionType'],
      sessionName: session?.label || sessionType,
      updatedAt: new Date(),
    });
  }, [menu, onMenuChange]);

  const handleDateChange = useCallback((date: string) => {
    onMenuChange({ ...menu, date, updatedAt: new Date() });
  }, [menu, onMenuChange]);

  const handleTimeChange = useCallback((field: 'startTime' | 'endTime', time: string) => {
    onMenuChange({ ...menu, [field]: time, updatedAt: new Date() });
  }, [menu, onMenuChange]);

  const handleHeadCountChange = useCallback((headCount: number) => {
    onMenuChange({ ...menu, headCount, updatedAt: new Date() });
  }, [menu, onMenuChange]);

  const handleAddItem = useCallback(() => {
    if (!newItem.itemId || newItem.quantity <= 0) {
      alert('Please select an item and enter quantity');
      return;
    }

    const selectedItem = currentCategoryItems.find(item => item.id === newItem.itemId);
    if (!selectedItem) {
      alert('Invalid item selected');
      return;
    }

    const itemName = selectedItem.name_en || selectedItem.name;
    const unitCost = selectedItem.estimatedCost || 0;

    const updatedItems = addMenuItem(
      menu.items,
      itemName,
      newItem.category,
      newItem.quantity,
      unitCost
    );

    onMenuChange({
      ...menu,
      items: updatedItems,
      updatedAt: new Date(),
    });

    setNewItem({ category: Object.keys(menuData)[0], itemId: '', quantity: 1 });
  }, [menu, newItem, currentCategoryItems, onMenuChange]);

  const handleUpdateItem = useCallback((itemId: string, field: keyof MenuItem, value: any) => {
    const updatedItems = updateMenuItem(menu.items, itemId, { [field]: value });
    onMenuChange({
      ...menu,
      items: updatedItems,
      updatedAt: new Date(),
    });
  }, [menu, onMenuChange]);

  const handleRemoveItem = useCallback((itemId: string) => {
    const updatedItems = removeMenuItem(menu.items, itemId);
    onMenuChange({
      ...menu,
      items: updatedItems,
      updatedAt: new Date(),
    });
  }, [menu, onMenuChange]);

  const handleExportPDF = useCallback(() => {
    if (menu.items.length === 0) {
      alert('Please add menu items before exporting');
      return;
    }
    generateMenuPDF(menu);
  }, [menu]);

  return (
    <div className="space-y-6">
      {/* Event Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue Name</Label>
              <Input
                id="venue"
                value={menu.venueName}
                onChange={(e) => handleVenueChange(e.target.value)}
                placeholder="Enter venue name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session Type</Label>
              <Select value={menu.sessionType} onValueChange={handleSessionChange}>
                <SelectTrigger id="session">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TYPES.map(session => (
                    <SelectItem key={session.value} value={session.value}>
                      {session.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={menu.date}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headcount">Head Count</Label>
              <Input
                id="headcount"
                type="number"
                min="1"
                placeholder="1"
                value={menu.headCount === undefined || menu.headCount === null ? '' : menu.headCount}
                onChange={(e) => {
                  const val = e.target.value;
                  handleHeadCountChange(val === '' ? ('' as any) : Math.max(0, parseInt(val, 10) || 0));
                }}
                onBlur={() => {
                  if (!menu.headCount || Number(menu.headCount) < 1) {
                    handleHeadCountChange(1);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starttime">Start Time</Label>
              <Input
                id="starttime"
                type="time"
                value={menu.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endtime">End Time</Label>
              <Input
                id="endtime"
                type="time"
                value={menu.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Menu Item Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Menu Item from Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value, itemId: '' })}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Item</Label>
              <Select value={newItem.itemId} onValueChange={(value) => setNewItem({ ...newItem, itemId: value })}>
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategoryItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name_en || item.name} (₹{item.estimatedCost || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Qty</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={newItem.quantity === undefined || newItem.quantity === null ? '' : newItem.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewItem({ ...newItem, quantity: val === '' ? ('' as any) : Math.max(0, parseInt(val, 10) || 0) });
                }}
                onBlur={() => {
                  if (!newItem.quantity || Number(newItem.quantity) < 1) {
                    setNewItem({ ...newItem, quantity: 1 });
                  }
                }}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      {menu.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={item.quantity === undefined || item.quantity === null ? '' : item.quantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateItem(item.id, 'quantity', val === '' ? ('' as any) : Math.max(0, parseInt(val, 10) || 0));
                          }}
                          onBlur={() => {
                            if (!item.quantity || Number(item.quantity) < 1) {
                              handleUpdateItem(item.id, 'quantity', 1);
                            }
                          }}
                          className="h-8 text-right w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          value={item.unitCost === undefined || item.unitCost === null ? '' : item.unitCost}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleUpdateItem(item.id, 'unitCost', val === '' ? ('' as any) : Math.max(0, parseFloat(val) || 0));
                          }}
                          className="h-8 text-right w-24"
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{item.totalCost.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Section */}
      {menu.items.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{summary.totalItems}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold">{summary.totalQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-2xl font-bold">₹{summary.subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tax (5%)</p>
                <p className="text-2xl font-bold">₹{summary.tax.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Grand Total</p>
                <p className="text-2xl font-bold text-blue-600">₹{summary.grandTotal.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Per Person</p>
                <p className="text-2xl font-bold text-green-600">₹{summary.costPerPerson.toFixed(2)}</p>
              </div>
            </div>

            <Button onClick={handleExportPDF} className="w-full mt-6" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
