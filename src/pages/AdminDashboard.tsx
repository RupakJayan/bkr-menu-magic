import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDownToLine, CalendarDays, Download, FileJson, LogOut, Menu as MenuIcon, Plus, Search, Trash2, Users } from "lucide-react";
import type { EventMenu } from "@/types/menu";
import {
  buildCatalogKey,
  deleteContact,
  deleteSavedEvent,
  getBusinessSettings,
  getContacts,
  getManagedMenuCatalog,
  getMenuAdminState,
  getSavedEvents,
  saveBusinessSettings,
  saveContact,
  saveEventMenu,
  saveMenuAdminState,
  updateEventStatus,
  type BusinessSettings,
  type EventStatus,
  type LocalContact,
  type ManagedMenuState,
  type SavedEvent,
} from "@/services/localAdminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { generateEventMenuDOCX } from "@/services/docxExportService";
import { formatISTDate, getISTDateString } from "@/utils/istDate";

type Tab = "overview" | "events" | "calendar" | "contacts" | "menu" | "analytics" | "settings";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "events", label: "Events" },
  { id: "calendar", label: "Calendar" },
  { id: "contacts", label: "Users & Contacts" },
  { id: "menu", label: "Menu Management" },
  { id: "analytics", label: "Analytics" },
  { id: "settings", label: "Settings" },
];
const STATUS_OPTIONS: EventStatus[] = ["pending", "confirmed", "completed", "cancelled"];

const downloadText = (fileName: string, text: string, type: string) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const formatMoney = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const eventDate = (menu: EventMenu) => menu.startDate === menu.endDate
  ? menu.startDate
  : `${menu.startDate} – ${menu.endDate}`;
const eventAmount = (menu: EventMenu) => menu.days
  .flatMap((day) => day.sessions)
  .reduce((sum, session) => sum + (session.ratePerPerson ?? 0) * session.headCount, 0)
  + (menu.transportCharge ?? 0);

const todayString = () => {
  return getISTDateString();
};

const makeBlankMenu = (): EventMenu => ({
  id: `menu_${crypto.randomUUID()}`,
  clientDetails: { name: "", phone: "" },
  venueDetails: { name: "", address: "" },
  startDate: todayString(),
  endDate: todayString(),
  numberOfDays: 1,
  days: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const statusStyles: Record<EventStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <h2 className="mb-4 text-lg font-bold text-gray-900">{title}</h2>
    {children}
  </section>
);

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(`${getISTDateString().slice(0, 7)}-01T06:30:00.000Z`));
  const [events, setEvents] = useState<SavedEvent[]>(() => getSavedEvents());
  const [contacts, setContacts] = useState<LocalContact[]>(() => getContacts());
  const [menuState, setMenuState] = useState<ManagedMenuState>(() => getMenuAdminState());
  const [settings, setSettings] = useState<BusinessSettings>(() => getBusinessSettings());
  const [query, setQuery] = useState("");
  const [contactDraft, setContactDraft] = useState({ name: "", email: "", phone: "", role: "Staff" as LocalContact["role"] });
  const [newDish, setNewDish] = useState({ category: "", name_en: "", name_ta: "", estimatedCost: "0" });
  const [notice, setNotice] = useState("");

  const managedCatalog = getManagedMenuCatalog();
  const filteredEvents = events.filter(({ menu }) =>
    `${menu.clientDetails.name} ${menu.venueDetails.name} ${menu.clientDetails.phone}`
      .toLowerCase().includes(query.toLowerCase()),
  );
  const eventSessions = events.flatMap(({ menu }) => menu.days.flatMap((day) =>
    day.sessions.map((session) => ({ menu, day, session })),
  ));
  const totalQuote = events.reduce((sum, { menu }) => sum + eventAmount(menu), 0);

  const refreshEvents = () => setEvents(getSavedEvents());
  const refreshContacts = () => setContacts(getContacts());
  const refreshMenu = () => setMenuState(getMenuAdminState());

  const startBooking = (event?: SavedEvent) => {
    if (event) {
      window.localStorage.setItem("currentMenu", JSON.stringify(event.menu));
    } else {
      window.localStorage.setItem("currentMenu", JSON.stringify(makeBlankMenu()));
    }
    navigate("/menu-creator");
  };

  const exportEvents = () => {
    const header = ["Client", "Phone", "Venue", "Start date", "End date", "Head count", "Quoted total", "Status"];
    const rows = events.map(({ menu, status }) => [
      menu.clientDetails.name,
      menu.clientDetails.phone,
      menu.venueDetails.name,
      menu.startDate,
      menu.endDate,
      menu.days.flatMap((day) => day.sessions).reduce((sum, session) => sum + session.headCount, 0),
      eventAmount(menu),
      status,
    ]);
    downloadText("bkr-events.csv", [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n"), "text/csv;charset=utf-8");
  };

  const saveEventStatus = (id: string, status: EventStatus) => {
    try {
      setEvents(updateEventStatus(id, status));
      setNotice("Event status saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update event status.");
    }
  };

  const addContact = () => {
    if (!contactDraft.name.trim() || !contactDraft.phone.trim()) {
      setNotice("Enter a name and phone number to add a contact.");
      return;
    }
    try {
      setContacts(saveContact({ ...contactDraft, id: crypto.randomUUID(), name: contactDraft.name.trim() }));
      setContactDraft({ name: "", email: "", phone: "", role: "Staff" });
      setNotice("Contact saved in this browser.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save contact.");
    }
  };

  const updateMenuState = (next: ManagedMenuState) => {
    try {
      setMenuState(saveMenuAdminState(next));
      setNotice("Menu catalog changes saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save menu catalog changes.");
    }
  };

  const addDish = () => {
    const category = newDish.category.trim();
    if (!category || !newDish.name_en.trim() || !newDish.name_ta.trim()) {
      setNotice("Enter an English and Tamil name and choose a category.");
      return;
    }
    const normalizedEnglish = newDish.name_en.trim().toLocaleLowerCase();
    const normalizedTamil = newDish.name_ta.trim().toLocaleLowerCase();
    const existing = managedCatalog[category] ?? [];
    if (existing.some((dish) =>
      dish.name_en.trim().toLocaleLowerCase() === normalizedEnglish
      || dish.name_ta.trim().toLocaleLowerCase() === normalizedTamil,
    )) {
      setNotice("That dish already exists in this category.");
      return;
    }
    const customDishes = [...menuState.customDishes, {
      id: `custom-${crypto.randomUUID()}`,
      category,
      name: newDish.name_en.trim(),
      name_en: newDish.name_en.trim(),
      name_ta: newDish.name_ta.trim(),
      estimatedCost: Math.max(0, Number(newDish.estimatedCost) || 0),
      isVegetarian: true,
      image: "",
    }];
    updateMenuState({ ...menuState, customDishes });
    setNewDish({ category: "", name_en: "", name_ta: "", estimatedCost: "0" });
  };

  const saveSettings = () => {
    try {
      setSettings(saveBusinessSettings(settings));
      setNotice("Business settings saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save business settings.");
    }
  };

  const exportBackup = () => {
    downloadText(
      "bkr-admin-backup.json",
      JSON.stringify({ exportedAt: new Date().toISOString(), events, contacts, menuState, settings }, null, 2),
      "application/json",
    );
  };

  const exportEventDocument = async (event: SavedEvent, language: "en" | "ta") => {
    try {
      await generateEventMenuDOCX(event.menu, language);
      setNotice(`${language === "ta" ? "Tamil" : "English"} Word menu downloaded.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not export the Word document.");
    }
  };

  const today = todayString();
  const upcomingEvents = events.filter(({ menu, status }) => menu.startDate >= today && status !== "cancelled");
  const savedDishes = Object.values(managedCatalog).reduce((sum, dishes) => sum + dishes.length, 0);

  return (
    <div className="admin-dashboard min-h-screen bg-slate-50 text-ink">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          <div>
            <Link to="/" className="admin-dashboard-brand" aria-label="BKR Catering home">
              <BrandLogo />
            </Link>
            <p className="text-sm text-gray-500">{settings.businessName} · Local Admin</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => startBooking()}>Create event</Button>
            <Button variant="outline" onClick={exportBackup}><FileJson className="mr-2 h-4 w-4" />Backup</Button>
            <Button onClick={exportEvents}><ArrowDownToLine className="mr-2 h-4 w-4" />Export events</Button>
            <Button variant="ghost" onClick={onLogout}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap gap-2 border-b pb-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item.id ? "bg-rose-600 text-white" : "bg-white text-gray-700 hover:bg-rose-50"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {notice && (
          <div role="status" className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            {notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>
          </div>
        )}

        {tab === "overview" && (
          <>
            <div>
              <h1 className="text-2xl font-bold">Event dashboard</h1>
              <p className="text-sm text-gray-500">Live totals from menus saved on this device; no sample records are included.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Saved events", events.length],
                ["Upcoming events", upcomingEvents.length],
                ["Contacts", contacts.length],
                ["Quoted total", formatMoney(totalQuote)],
              ].map(([label, value]) => (
                <Card key={String(label)} title={String(label)}><p className="text-3xl font-bold text-rose-700">{value}</p></Card>
              ))}
            </div>
            <Card title="Upcoming events">
              <EventTable
                events={upcomingEvents.slice(0, 8)}
                query={query}
                setQuery={setQuery}
                onStatusChange={saveEventStatus}
                onOpen={startBooking}
                onDelete={(id) => { setEvents(deleteSavedEvent(id)); setNotice("Event deleted."); }}
                onExport={exportEventDocument}
              />
            </Card>
          </>
        )}

        {tab === "events" && (
          <Card title="Saved events and bookings">
            <p className="mb-4 text-sm text-gray-500">Bookings are stored in this browser. Creating or editing a menu saves it here when you generate a document.</p>
            <EventTable
              events={filteredEvents}
              query={query}
              setQuery={setQuery}
              onStatusChange={saveEventStatus}
              onOpen={startBooking}
              onDelete={(id) => { setEvents(deleteSavedEvent(id)); setNotice("Event deleted."); }}
              onExport={exportEventDocument}
            />
          </Card>
        )}

        {tab === "calendar" && (
          <Card title="Upcoming calendar">
            <p className="mb-4 text-sm text-gray-500">Monthly view of saved events. Select an event to open its menu.</p>
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" onClick={() => setCalendarMonth(new Date(Date.UTC(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth() - 1, 1, 6, 30)))}>Previous month</Button>
              <h3 className="font-bold">{formatISTDate(`${calendarMonth.getUTCFullYear()}-${String(calendarMonth.getUTCMonth() + 1).padStart(2, "0")}-01`, "en-IN", { month: "long", year: "numeric" })}</h3>
              <Button variant="outline" onClick={() => setCalendarMonth(new Date(Date.UTC(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth() + 1, 1, 6, 30)))}>Next month</Button>
            </div>
            <div className="grid grid-cols-7 border-l border-t text-xs">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="border-b border-r bg-gray-50 p-2 text-center font-bold">{day}</div>)}
              {Array.from({ length: 42 }, (_, index) => {
                const monthStart = new Date(Date.UTC(calendarMonth.getUTCFullYear(), calendarMonth.getUTCMonth(), 1));
                const dayDate = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), index - monthStart.getUTCDay() + 1, 6, 30));
                const key = `${dayDate.getUTCFullYear()}-${String(dayDate.getUTCMonth() + 1).padStart(2, "0")}-${String(dayDate.getUTCDate()).padStart(2, "0")}`;
                const items = events.filter(({ menu, status }) =>
                  status !== "cancelled" && menu.startDate <= key && menu.endDate >= key,
                );
                const inMonth = dayDate.getUTCMonth() === calendarMonth.getUTCMonth();
                return (
                  <div key={key} className={`min-h-24 border-b border-r p-1.5 ${inMonth ? "bg-white" : "bg-gray-50 text-gray-400"}`}>
                    <span>{dayDate.getUTCDate()}</span>
                    <div className="mt-1 space-y-1">
                      {items.map((event) => <button key={event.id} onClick={() => startBooking(event)} title={`${event.menu.clientDetails.name} · ${event.menu.venueDetails.name}`} className="block w-full truncate rounded bg-rose-100 px-1 py-1 text-left text-[10px] text-rose-900">{event.menu.clientDetails.name || event.menu.venueDetails.name || "Event"}</button>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {tab === "contacts" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
            <Card title="Add customer or staff contact">
              <div className="space-y-3">
                <Input placeholder="Name *" value={contactDraft.name} onChange={(e) => setContactDraft({ ...contactDraft, name: e.target.value })} />
                <Input placeholder="Phone *" value={contactDraft.phone} onChange={(e) => setContactDraft({ ...contactDraft, phone: e.target.value })} />
                <Input type="email" placeholder="Email" value={contactDraft.email} onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })} />
                <select className="h-10 w-full rounded-md border px-3" value={contactDraft.role} onChange={(e) => setContactDraft({ ...contactDraft, role: e.target.value as LocalContact["role"] })}>
                  {["Admin", "Manager", "Staff"].map((role) => <option key={role}>{role}</option>)}
                </select>
                <Button onClick={addContact} className="w-full"><Plus className="mr-2 h-4 w-4" />Save contact</Button>
              </div>
            </Card>
            <Card title={`Contacts (${contacts.length})`}>
              {contacts.length === 0 ? <Empty message="No manually added contacts yet. Client details are available in saved event records." /> : (
                <div className="divide-y">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 py-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div className="min-w-0 flex-1"><b>{contact.name}</b><p className="truncate text-sm text-gray-500">{contact.phone} · {contact.email || "No email"} · {contact.role}</p></div>
                      <Button variant="ghost" size="icon" aria-label={`Delete ${contact.name}`} onClick={() => { setContacts(deleteContact(contact.id)); setNotice("Contact deleted."); }}><Trash2 className="h-4 w-4 text-rose-600" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {tab === "menu" && (
          <div className="space-y-5">
            <Card title="Add a catalog dish">
              <div className="grid gap-3 md:grid-cols-5">
                <Input placeholder="Category" value={newDish.category} onChange={(e) => setNewDish({ ...newDish, category: e.target.value })} />
                <Input placeholder="English name" value={newDish.name_en} onChange={(e) => setNewDish({ ...newDish, name_en: e.target.value })} />
                <Input placeholder="Tamil name" value={newDish.name_ta} onChange={(e) => setNewDish({ ...newDish, name_ta: e.target.value })} />
                <Input type="number" min="0" placeholder="Estimated cost" value={newDish.estimatedCost} onChange={(e) => setNewDish({ ...newDish, estimatedCost: e.target.value })} />
                <Button onClick={addDish}><Plus className="mr-2 h-4 w-4" />Add dish</Button>
              </div>
            </Card>
            <Card title={`Available dishes (${savedDishes})`}>
              <div className="max-h-[65vh] space-y-5 overflow-y-auto">
                {Object.entries(managedCatalog).map(([category, dishes]) => (
                  <div key={category}>
                    <h3 className="mb-2 font-bold text-rose-700">{category}</h3>
                    <div className="divide-y rounded-lg border">
                      {dishes.map((dish) => {
                        const key = buildCatalogKey(category, dish.id);
                        const custom = menuState.customDishes.some((item) => item.id === dish.id);
                        return (
                          <div key={key} className="grid gap-2 p-3 md:grid-cols-[1fr_1fr_130px_auto] md:items-center">
                            <Input aria-label="English dish name" value={dish.name_en} onChange={(e) => {
                              if (custom) {
                                updateMenuState({ ...menuState, customDishes: menuState.customDishes.map((item) => item.id === dish.id ? { ...item, name: e.target.value, name_en: e.target.value } : item) });
                              } else updateMenuState({ ...menuState, overrides: { ...menuState.overrides, [key]: { ...menuState.overrides[key], name_en: e.target.value } } });
                            }} />
                            <Input aria-label="Tamil dish name" value={dish.name_ta} onChange={(e) => {
                              if (custom) updateMenuState({ ...menuState, customDishes: menuState.customDishes.map((item) => item.id === dish.id ? { ...item, name_ta: e.target.value } : item) });
                              else updateMenuState({ ...menuState, overrides: { ...menuState.overrides, [key]: { ...menuState.overrides[key], name_ta: e.target.value } } });
                            }} />
                            <Input aria-label="Dish estimated cost" type="number" min="0" value={dish.estimatedCost ?? 0} onChange={(e) => {
                              const estimatedCost = Math.max(0, Number(e.target.value) || 0);
                              if (custom) updateMenuState({ ...menuState, customDishes: menuState.customDishes.map((item) => item.id === dish.id ? { ...item, estimatedCost } : item) });
                              else updateMenuState({ ...menuState, overrides: { ...menuState.overrides, [key]: { ...menuState.overrides[key], estimatedCost } } });
                            }} />
                            {custom ? (
                              <Button variant="ghost" size="icon" aria-label={`Delete ${dish.name_en}`} onClick={() => updateMenuState({ ...menuState, customDishes: menuState.customDishes.filter((item) => item.id !== dish.id) })}><Trash2 className="h-4 w-4 text-rose-600" /></Button>
                            ) : (
                              <Button variant="outline" onClick={() => {
                                const disabled = menuState.overrides[key]?.isAvailable === false;
                                updateMenuState({ ...menuState, overrides: { ...menuState.overrides, [key]: { ...menuState.overrides[key], isAvailable: disabled } } });
                              }}>
                                {menuState.overrides[key]?.isAvailable === false ? "Restore" : "Hide"}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === "analytics" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card title="Bookings"><p className="text-2xl font-bold">{events.length}</p></Card>
              <Card title="Sessions"><p className="text-2xl font-bold">{eventSessions.length}</p></Card>
              <Card title="Guests (session count)"><p className="text-2xl font-bold">{eventSessions.reduce((sum, entry) => sum + entry.session.headCount, 0).toLocaleString("en-IN")}</p></Card>
              <Card title="Quoted revenue"><p className="text-2xl font-bold">{formatMoney(totalQuote)}</p></Card>
            </div>
            <Card title="Bookings by status">
              <div className="space-y-3">
                {STATUS_OPTIONS.map((status) => {
                  const count = events.filter((event) => event.status === status).length;
                  const width = events.length ? `${(count / events.length) * 100}%` : "0%";
                  return <div key={status} className="grid grid-cols-[100px_1fr_40px] items-center gap-3"><span className="capitalize">{status}</span><div className="h-3 rounded-full bg-gray-100"><div className={`h-full rounded-full ${status === "confirmed" ? "bg-blue-500" : status === "completed" ? "bg-emerald-500" : status === "cancelled" ? "bg-rose-500" : "bg-amber-500"}`} style={{ width }} /></div><b>{count}</b></div>;
                })}
              </div>
            </Card>
          </div>
        )}

        {tab === "settings" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Business settings">
              <label className="mb-2 block text-sm font-semibold">Business name</label>
              <Input value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
              <Button className="mt-3" onClick={saveSettings}>Save settings</Button>
            </Card>
            <Card title="Payment terms (English)">
              <TermsEditor value={settings.termsEnglish} onChange={(termsEnglish) => setSettings({ ...settings, termsEnglish })} />
            </Card>
            <Card title="Payment terms (Tamil)">
              <TermsEditor value={settings.termsTamil} onChange={(termsTamil) => setSettings({ ...settings, termsTamil })} />
              <Button className="mt-3" onClick={saveSettings}>Save business settings</Button>
            </Card>
            <Card title="Local storage and data export">
              <p className="mb-3 text-sm text-gray-600">This admin stores bookings, contacts, menu edits and settings in this browser only. It has no sign-in or cloud sync. Keep regular backups if you clear browser data or change devices.</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={exportBackup}><FileJson className="mr-2 h-4 w-4" />Download JSON backup</Button>
                <Button variant="outline" onClick={exportEvents}><Download className="mr-2 h-4 w-4" />Download event CSV</Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <p className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">{message}</p>;
}

function EventTable({
  events,
  query,
  setQuery,
  onStatusChange,
  onOpen,
  onDelete,
  onExport,
}: {
  events: SavedEvent[];
  query: string;
  setQuery: (query: string) => void;
  onStatusChange: (id: string, status: EventStatus) => void;
  onOpen: (event: SavedEvent) => void;
  onDelete: (id: string) => void;
  onExport: (event: SavedEvent, language: "en" | "ta") => void;
}) {
  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search client, venue, phone" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {events.length === 0 ? <Empty message={query ? "No events match this search." : "No saved event menus yet."} /> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead><tr className="border-b bg-gray-50 text-gray-500"><th className="p-3">Client</th><th className="p-3">Venue & date</th><th className="p-3">Sessions</th><th className="p-3">Quote</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b last:border-0">
                  <td className="p-3"><b>{event.menu.clientDetails.name || "Unnamed client"}</b><p className="text-gray-500">{event.menu.clientDetails.phone}</p></td>
                  <td className="p-3">{event.menu.venueDetails.name || "Venue not set"}<p className="text-gray-500">{eventDate(event.menu)}</p></td>
                  <td className="p-3">{event.menu.days.reduce((sum, day) => sum + day.sessions.length, 0)}</td>
                  <td className="p-3">{formatMoney(eventAmount(event.menu))}</td>
                  <td className="p-3"><select aria-label={`Status for ${event.menu.clientDetails.name}`} className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[event.status]}`} value={event.status} onChange={(e) => onStatusChange(event.id, e.target.value as EventStatus)}>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                  <td className="p-3"><div className="flex flex-wrap gap-1"><Button variant="outline" size="sm" onClick={() => onOpen(event)}>Edit</Button><Button variant="ghost" size="sm" onClick={() => void onExport(event, "en")}>EN Word</Button><Button variant="ghost" size="sm" onClick={() => void onExport(event, "ta")}>தமிழ் Word</Button><Button variant="ghost" size="icon" aria-label={`Delete ${event.menu.clientDetails.name} event`} onClick={() => onDelete(event.id)}><Trash2 className="h-4 w-4 text-rose-600" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TermsEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((term, index) => (
        <div key={index} className="flex gap-2">
          <Input aria-label={`Payment term ${index + 1}`} value={term} onChange={(e) => onChange(value.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} />
          <Button variant="ghost" size="icon" aria-label={`Remove term ${index + 1}`} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-rose-600" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...value, ""])}><Plus className="mr-2 h-4 w-4" />Add term</Button>
    </div>
  );
}
