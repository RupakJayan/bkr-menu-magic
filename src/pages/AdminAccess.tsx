import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import AdminDashboard from "@/pages/AdminDashboard";
import {
  hasAdminSession,
  isAdminPasswordConfigured,
  loginAdmin,
  logoutAdmin,
  setAdminPassword,
} from "@/services/adminAccessService";
import { requestGoogleLogin, getGoogleClientId } from "@/services/googleAuthService";

export default function AdminAccess() {
  const [configured, setConfigured] = useState(isAdminPasswordConfigured);
  const [authenticated, setAuthenticated] = useState(hasAdminSession);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setBusy(true);
      setError("");
      await requestGoogleLogin();
      sessionStorage.setItem("bkr-admin-session", "authenticated");
      setAuthenticated(true);
    } catch (err) {
      console.error("Google sign-in error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("401") || msg.toLowerCase().includes("client not found") || msg.toLowerCase().includes("invalid_client")) {
        setError(
          `Google OAuth Error: "${msg}". This means Google Cloud does not find or recognize Client ID ${getGoogleClientId().slice(0, 20)}... for this origin (${window.location.origin}). Ensure your OAuth Client ID is type "Web application" and has Authorized JavaScript Origin: ${window.location.origin}.`,
        );
      } else {
        setError(msg || "Google sign-in could not be completed.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleResetPassword = () => {
    try {
      localStorage.removeItem("bkr-admin-credentials");
      setConfigured(false);
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch {
      // ignore
    }
  };

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
    <main className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-10 text-ink">
      <ThemeToggle className="absolute right-4 top-4 sm:right-6 sm:top-6" />
      <section className="w-full max-w-md rounded-xl border border-line bg-surf p-6 shadow-theme sm:p-8">
        <Link to="/" className="admin-access-brand" aria-label="BKR Catering home">
          <BrandLogo />
        </Link>
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-surf2 text-acc">
          <LockKeyhole aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">
          {configured ? "Admin login" : "Set up admin access"}
        </h1>
        <p className="mt-2 text-sm text-mute">
          {configured
            ? "Enter the password set for this browser to manage events and menus."
            : "Create a password to protect the event planner and management tools on this browser."}
        </p>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 border-2 border-line hover:bg-surf2 h-11"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google Account
          </Button>
          <div className="text-[11px] text-mute text-center px-1">
            Sign in with your authorized BKR Catering Google Account
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-line"></div>
            <span className="flex-shrink mx-3 text-xs text-mute uppercase font-medium">Or browser password</span>
            <div className="flex-grow border-t border-line"></div>
          </div>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium">
            <div className="flex items-center justify-between">
              <span>{configured ? "Admin password" : "Create password"}</span>
              {configured && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-xs text-mute hover:text-acc underline font-normal"
                >
                  Reset password
                </button>
              )}
            </div>
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
            <div role="alert" className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-800">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-900 ml-2"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
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
