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
  Layers,
  Utensils,
  Maximize2,
  X,
} from "lucide-react";
import "./home.css";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { VectorGridOverlay } from "@/components/effects/VectorGridOverlay";
import { PhysicsHoverCard } from "@/components/ui/PhysicsHoverCard";
import {
  CrosshairVector,
  SpatialGridVector,
  DimensionCaliperVector,
  DatumVector,
} from "@/components/ui/VectorIcons";
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
            className="home-nav-3d px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#161822] text-[#e2c99a] border border-white/10 hover:border-[#e2c99a]/50 transition-all flex items-center gap-1.5 shadow-sm"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/3d-planner");
            }}
          >
            <CrosshairVector size={13} className="text-[#e2c99a]" />
            <span>3D Venue Planner</span>
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
          <VectorGridOverlay opacity={0.35} showCoordinates={false} />
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
                className="home-button home-button-secondary bg-[#0c0d16]/90 text-[#e2c99a] border border-white/10 hover:border-[#e2c99a]/50 flex items-center gap-2 transition-all shadow-lg font-mono text-xs"
                onClick={() => navigate("/3d-planner")}
              >
                <CrosshairVector size={15} /> 3D Mandapam & Stalls <ArrowRight size={15} />
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
        <section className="py-20 px-4 md:px-8 bg-[#090a0f] border-y border-line text-ink relative overflow-hidden select-none" id="3d-showcase">
          <VectorGridOverlay opacity={0.4} showCoordinates={true} />
          <div className="max-w-6xl mx-auto relative z-10 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#161822] border border-white/10 text-neutral-300 text-xs font-mono tracking-wider">
                <DatumVector size={13} className="text-[#e2c99a]" />
                <span>SPATIAL STAGING // 3D VENUE SIMULATOR</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white font-sans">
                Architectural Mandapam &amp; Live Counter Staging
              </h2>
              <p className="text-neutral-400 text-xs md:text-sm font-sans max-w-2xl mx-auto">
                Orthographic floorplan projection, crowd queue fluidics, and dual-wing service layout calculations for up to 100,000 guests.
              </p>
            </div>

            {/* Interactive 3D Hologram Preview Widget */}
            <div className="py-2">
              <Hero3DWidget />
            </div>

            {/* 3 Technical CAD Specification Cards with Physics Hover */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <PhysicsHoverCard
                className="p-6 rounded-xl bg-[#11131a]/90 border border-white/[0.08] backdrop-blur-xl space-y-3 hover:border-[#e2c99a]/50 transition-colors"
                maxTilt={6}
              >
                <div className="w-10 h-10 rounded-lg bg-[#181b24] border border-white/10 text-[#e2c99a] flex items-center justify-center">
                  <DimensionCaliperVector size={20} />
                </div>
                <h3 className="text-base font-bold text-white font-mono">01 // DUAL-WING ROUTING</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Single live counters cause 25+ min bottlenecks. Erlang-C calculations automatically deploy 2x Live Dosa stations across North and South wings with 5.5m clear corridors.
                </p>
              </PhysicsHoverCard>

              {/* Feature 2 */}
              <PhysicsHoverCard
                className="p-6 rounded-xl bg-[#11131a]/90 border border-white/[0.08] backdrop-blur-xl space-y-3 hover:border-[#e2c99a]/50 transition-colors"
                maxTilt={6}
              >
                <div className="w-10 h-10 rounded-lg bg-[#181b24] border border-white/10 text-[#e2c99a] flex items-center justify-center">
                  <SpatialGridVector size={20} />
                </div>
                <h3 className="text-base font-bold text-white font-mono">02 // BLUEPRINT PROJECTION</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Project aerial Google Maps floorplans directly onto the 3D ground plane with adjustable opacity. Calibrate actual pillar clearances and service aisles.
                </p>
              </PhysicsHoverCard>

              {/* Feature 3 */}
              <PhysicsHoverCard
                className="p-6 rounded-xl bg-[#11131a]/90 border border-white/[0.08] backdrop-blur-xl space-y-3 hover:border-[#e2c99a]/50 transition-colors"
                maxTilt={6}
              >
                <div className="w-10 h-10 rounded-lg bg-[#181b24] border border-white/10 text-[#e2c99a] flex items-center justify-center">
                  <CrosshairVector size={20} />
                </div>
                <h3 className="text-base font-bold text-white font-mono">03 // 360° ORBITAL TELEMETRY</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Toggle between 3D Orbital Flythrough, 2D CAD Blueprint, and eye-level Walkthrough. Export high-resolution isometric blueprints for client proposals.
                </p>
              </PhysicsHoverCard>
            </div>

            <div className="text-center pt-2">
              <Button
                size="lg"
                onClick={() => navigate("/3d-planner")}
                className="h-11 px-8 text-xs font-mono font-bold bg-[#e2c99a] hover:bg-[#c5a059] text-black rounded-xl shadow-lg inline-flex items-center gap-2 transition-transform hover:scale-102 active:scale-95"
              >
                <CrosshairVector size={16} /> Launch 3D Venue Simulator <ArrowRight size={16} />
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
