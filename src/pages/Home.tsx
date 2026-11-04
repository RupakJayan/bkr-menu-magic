import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  Instagram,
  MapPin,
  Menu as MenuIcon,
  Phone,
  ExternalLink,
  Sparkles,
  Layers,
  Utensils,
  Maximize2,
  X,
} from "lucide-react";
import "./home.css";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { LusionParticles } from "@/components/effects/LusionParticles";
import { Hero3DWidget } from "@/components/planner3d/Hero3DWidget";
import { assetUrl } from "@/utils/assetUrl";
import {
  hasAdminSession,
  subscribeToAdminSession,
} from "@/services/adminAccessService";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(hasAdminSession);

  useEffect(() => subscribeToAdminSession(() => setIsAdmin(hasAdminSession())), []);

  const scrollToSection = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const rawTarget =
      location.pathname.replace(/^\//, "") ||
      window.location.hash.replace(/^#\/?/, "");
    const targetId = rawTarget.split("/")[0];
    if (
      targetId &&
      ["instagram", "our-approach", "experience", "how-it-works", "contact"].includes(
        targetId,
      )
    ) {
      const timer = window.setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const primaryPhone = "+91 80126 86883";
  const primaryPhoneHref = "tel:+918012686883";
  const secondaryPhone = "+91 70109 68184";
  const secondaryPhoneHref = "tel:+917010968184";
  const kitchenAddress = "1B, Krishna Iyengar Street, Anaimalai";
  const kitchenMapUrl = "https://maps.app.goo.gl/YXXNzhruoA9XZwn26";

  return (
    <div className="home-page">
      <div className="home-utility-bar">
        <span>Thoughtful catering for gatherings big and small</span>
        <div className="home-utility-contacts" aria-label="Call BKR Catering">
          <a href={primaryPhoneHref}>{primaryPhone}</a>
          <a href={secondaryPhoneHref}>{secondaryPhone}</a>
        </div>
      </div>
      <header className="home-nav">
        <Link className="home-brand" to="/" aria-label="BKR Catering home">
          <BrandLogo />
          <span>Good food, warmly served.</span>
        </Link>
        <nav
          id="home-main-navigation"
          className={`home-nav-links${mobileMenuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#our-approach" onClick={(e) => scrollToSection("our-approach", e)}>Our approach</a>
          <a href="#experience" onClick={(e) => scrollToSection("experience", e)}>Our food</a>
          <a href="#how-it-works" onClick={(e) => scrollToSection("how-it-works", e)}>How it works</a>
          <a href="#instagram" onClick={(e) => scrollToSection("instagram", e)}>From our kitchen</a>
          <a href="#contact" onClick={(e) => scrollToSection("contact", e)}>Contact</a>
          <button
            className="home-nav-3d px-3 py-1.5 rounded-full text-xs font-bold bg-[#00f5d4]/15 text-[#00f5d4] border border-[#00f5d4]/40 hover:bg-[#00f5d4] hover:text-black transition-all flex items-center gap-1.5 shadow-sm"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/3d-planner");
            }}
          >
            <Sparkles size={13} className="text-[#00f5d4]" />
            3D Mandapam & Buffet
          </button>
          <ThemeToggle className="home-theme-toggle" />
          <button className="home-nav-admin" onClick={() => { setMobileMenuOpen(false); navigate("/admin"); }}>
            {isAdmin ? "Admin dashboard" : "Admin login"}
          </button>
          <button className="home-button home-button-small" onClick={() => { setMobileMenuOpen(false); navigate("/menu-creator"); }}>
            Plan an event <ArrowRight size={16} />
          </button>
        </nav>
        <button
          type="button"
          className="home-menu-toggle"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="home-main-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </header>

      <main>
        <section className="home-hero relative overflow-hidden" aria-label="BKR Catering introduction">
          <LusionParticles particleCount={45} speed={0.5} />
          <img
            className="home-hero-image"
            src={assetUrl("/home-catering-table.jpg")}
            alt=""
          />
          <div className="home-hero-copy relative z-10">
            <p className="home-eyebrow"><span /> A taste of Anaimalai</p>
            <h1>
              A good celebration
              <br />
              {" "}
              starts <em>at the table.</em>
            </h1>
            <p className="home-intro">
              Thoughtful South Indian menus, planned around your people, your
              traditions and the moments you want to remember.
            </p>
            <div className="home-hero-actions flex flex-wrap gap-3">
              <button className="home-button" onClick={() => navigate("/menu-creator")}>
                Plan your event <ArrowRight size={17} />
              </button>
              <button
                className="home-button home-button-secondary bg-[#0c0d16]/80 text-[#00f5d4] border border-[#00f5d4]/40 hover:bg-[#00f5d4] hover:text-black flex items-center gap-2 transition-all shadow-lg"
                onClick={() => navigate("/3d-planner")}
              >
                <Sparkles size={16} /> 3D Mandapam & Stalls <ArrowRight size={15} />
              </button>
              <a className="home-text-link" href="#how-it-works">
                See how it works <ArrowDown size={15} />
              </a>
            </div>
            <div className="home-trust-note">
              <span className="home-check"><Check size={14} /></span>
              <span>Build your menu at your own pace. Save it and come back any time.</span>
            </div>
          </div>
          <a className="home-hero-scroll" href="#3d-showcase" aria-label="Scroll to 3D visualizer">
            <span>Scroll to discover</span><ArrowDown size={15} />
          </a>
        </section>

        {/* 3D MANDAPAM & BUFFET VISUALIZER SHOWCASE */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-[#050508] via-[#0c0d16] to-[#050508] border-y border-line text-ink relative overflow-hidden" id="3d-showcase">
          <LusionParticles particleCount={30} speed={0.3} />
          <div className="max-w-6xl mx-auto relative z-10 space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} /> Next-Gen 3D Interactive Venue Planner
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Visualize Buffet & Live Stalls in{" "}
                <span className="bg-gradient-to-r from-[#00f5d4] via-[#38bdf8] to-[#d8b36d] bg-clip-text text-transparent">
                  Photorealistic 3D
                </span>
              </h2>
              <p className="text-mute text-base md:text-lg">
                Walk your clients through their actual Mandapam before the event. Project Google Maps floor plans, balance guest flow, and avoid bottlenecks.
              </p>
            </div>

            {/* Interactive 3D Hologram Preview Widget */}
            <div className="py-2">
              <Hero3DWidget />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-line backdrop-blur-xl space-y-3 hover:border-[#00f5d4]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] flex items-center justify-center">
                  <Utensils size={20} />
                </div>
                <h3 className="text-lg font-bold text-ink">Smart Counter Duplication</h3>
                <p className="text-xs text-mute leading-relaxed">
                  Single live Dosa or Chaat counters cause huge 25+ min bottlenecks. Our capacity engine automatically recommends <strong>2x Live Dosa stations</strong> (North & South wings) based on your guest headcount.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-line backdrop-blur-xl space-y-3 hover:border-[#d8b36d]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#d8b36d]/10 border border-[#d8b36d]/30 text-[#d8b36d] flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold text-ink">Google Maps Hall Projection</h3>
                <p className="text-xs text-mute leading-relaxed">
                  Every Kalyana Mandapam in Pollachi, Coimbatore, and Anaimalai has layout imagery on Google Maps. Project floor plans directly onto the 3D ground plane with adjustable opacity.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-line backdrop-blur-xl space-y-3 hover:border-[#38bdf8]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center">
                  <Maximize2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-ink">360° Walkthrough & Snapshots</h3>
                <p className="text-xs text-mute leading-relaxed">
                  Switch between 3D Orbital Flyover, 2D Architectural Blueprint, and eye-level Guest Walkthrough. Export high-res PNG snapshots to attach to client catering proposals.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/3d-planner")}
                className="h-12 px-8 text-sm bg-gradient-to-r from-[#00f5d4] to-[#0284c7] hover:opacity-90 text-black font-extrabold rounded-2xl shadow-xl shadow-[#00f5d4]/20 inline-flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles size={18} /> Launch 3D Mandapam & Stalls Visualizer <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        </section>

        <section className="home-intro-strip" id="our-approach">
          <p className="home-section-kicker">Our approach</p>
          <div className="home-intro-content">
            <h2>Every occasion has its own way of bringing people together.</h2>
            <div>
              <p>
                We make it easier to plan the food around your day: familiar
                South Indian favourites, considered session by session, and
                menus ready to share in English or Tamil.
              </p>
              <a className="home-text-link" href="#how-it-works">
                How planning works <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section className="home-experience" id="experience">
          <div className="home-experience-copy">
            <p className="home-section-kicker">Food made for sharing</p>
            <h2>Rooted in the flavours of home. Ready for the joy of a crowd.</h2>
            <p>
              From the first welcome to the last cup of coffee, bring every
              gathering together with familiar South Indian favourites and a
              menu that feels like yours.
            </p>
            <a className="home-text-link" href="#how-it-works" onClick={(e) => scrollToSection("how-it-works", e)}>
              Shape your menu <ArrowRight size={15} />
            </a>
            <span className="home-experience-note">BKR CATERING <span>·</span> ANAIMALAI, TAMIL NADU</span>
          </div>
          <div className="home-experience-gallery" aria-label="Food and celebration">
            <figure className="home-experience-photo home-experience-photo-table">
              <img
                src={assetUrl("/home-south-indian-feast.jpg")}
                alt="A celebratory biryani meal prepared for sharing"
                loading="lazy"
              />
              <figcaption>
                <span>Served for sharing</span>
                <strong>A generous feast.</strong>
              </figcaption>
            </figure>
            <figure className="home-experience-photo home-experience-photo-food">
              <img
                src={assetUrl("/home-south-indian-snacks.jpg")}
                alt="Golden samosas with fresh green chutney"
                loading="lazy"
              />
              <figcaption>
                <span>A little something to begin</span>
                <strong>Good things to share.</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="home-steps" id="how-it-works">
          <div className="home-steps-heading">
            <p className="home-section-kicker">A considered way to plan</p>
            <h2>From the first detail to the final menu.</h2>
          </div>
          <article className="home-step-card">
            <span className="home-step-number">01</span>
            <CalendarDays aria-hidden="true" />
            <h3>Set the scene</h3>
            <p>Share your venue, dates and guest count. Add each day and gathering when your event spans multiple sessions.</p>
          </article>
          <article className="home-step-card">
            <span className="home-step-number">02</span>
            <MenuIcon aria-hidden="true" />
            <h3>Bring your menu together</h3>
            <p>Explore South Indian favourites and select the right dishes for each gathering, with selections kept together as you plan.</p>
          </article>
          <article className="home-step-card">
            <span className="home-step-number">03</span>
            <FileText aria-hidden="true" />
            <h3>Review and share</h3>
            <p>Check your details, add rates and prepare a polished PDF or editable Word menu in English or Tamil.</p>
          </article>
        </section>

        <section className="home-instagram" id="instagram">
          <div className="home-instagram-copy">
            <p className="home-section-kicker">A glimpse of BKR</p>
            <h2>From our kitchen to your celebrations.</h2>
            <p>
              Follow BKR Events &amp; Catering for a taste of our celebrations,
              menus and moments from the kitchen.
            </p>
            <a
              className="home-button home-instagram-link"
              href="https://www.instagram.com/bkr_events_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={17} />
              Follow @bkr_events_
              <ExternalLink size={15} />
            </a>
          </div>
          <div className="home-instagram-embed" aria-label="BKR Events Instagram feed">
            <iframe
              title="BKR Events & Catering on Instagram"
              src="https://www.instagram.com/bkr_events_/embed"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="clipboard-write; encrypted-media; picture-in-picture"
            />
          </div>
        </section>

        <section className="home-callout">
          <div>
            <p className="home-section-kicker">{isAdmin ? "Begin with the occasion" : "Planning a celebration?"}</p>
            <h2>{isAdmin ? "Let’s plan something worth gathering for." : "Let’s make your gathering memorable."}</h2>
            <p>{isAdmin
              ? "Build your menu at your own pace. Save your draft and return to it whenever you’re ready."
              : "Tell us about your occasion and our team will help you plan the menu."}</p>
          </div>
          {isAdmin ? (
            <button className="home-button home-button-light" onClick={() => navigate("/menu-creator")}>
              Start planning <ArrowRight size={17} />
            </button>
          ) : (
            <a className="home-button home-button-light" href={primaryPhoneHref}>
              Call BKR Catering <Phone size={17} />
            </a>
          )}
        </section>
      </main>

      <footer className="home-footer" id="contact">
        <div className="home-footer-brand">
          <BrandLogo />
          <p>Good food brings people together.</p>
        </div>
        <div className="home-footer-contact">
          <a href={kitchenMapUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={16} />
            <span>{kitchenAddress}</span>
            <ExternalLink size={13} />
          </a>
          <a href={primaryPhoneHref}><Phone size={16} /> {primaryPhone}</a>
          <a href={secondaryPhoneHref}><Phone size={16} /> {secondaryPhone}</a>
          <a href="mailto:bkrcaters@gmail.com">bkrcaters@gmail.com</a>
        </div>
        <span className="home-copyright">© 2026 BKR Catering</span>
      </footer>
    </div>
  );
};

export default Home;
