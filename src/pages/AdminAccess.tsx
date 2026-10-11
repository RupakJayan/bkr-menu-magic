import { useState, type FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminDashboard from "@/pages/AdminDashboard";
import {
  hasAdminSession,
  isAdminPasswordConfigured,
  loginAdmin,
  logoutAdmin,
  setAdminPassword,
} from "@/services/adminAccessService";

export default function AdminAccess() {
  const [configured, setConfigured] = useState(isAdminPasswordConfigured);
  const [authenticated, setAuthenticated] = useState(hasAdminSession);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (!configured) {
        if (password !== confirmPassword) {
          setError("The passwords do not match.");
          return;
        }
        await setAdminPassword(password);
        setConfigured(true);
        setAuthenticated(true);
        return;
      }

      if (await loginAdmin(password)) {
        setAuthenticated(true);
      } else {
        setError("That password was not recognised. Please try again.");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not update admin access. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthenticated(false);
    setPassword("");
  };

  if (authenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-10 text-ink">
      <section className="w-full max-w-md rounded-xl border border-line bg-surf p-6 shadow-theme sm:p-8">
        <a href="/" className="text-sm font-semibold text-acc hover:underline">
          BKR Catering
        </a>
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-surf2 text-acc">
          <LockKeyhole aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">
          {configured ? "Admin login" : "Set up admin access"}
        </h1>
        <p className="mt-2 text-sm text-mute">
          {configured
            ? "Enter the password set for this browser to manage events and menus."
            : "Create a password to protect the admin screens on this browser. Normal menu planning stays open to everyone."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium">
            <span>{configured ? "Admin password" : "Create password"}</span>
            <Input
              type="password"
              autoComplete={configured ? "current-password" : "new-password"}
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
            />
          </label>
          {!configured && (
            <label className="block space-y-2 text-sm font-medium">
              <span>Confirm password</span>
              <Input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          )}
          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={busy}>
            {busy
              ? "Please wait…"
              : configured
                ? "Sign in to admin"
                : "Save password and continue"}
          </Button>
        </form>

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-mute">
          This is a local access gate, not server-backed security. Admin data
          and this password are stored in this browser only.
        </p>
      </section>
    </main>
  );
}
