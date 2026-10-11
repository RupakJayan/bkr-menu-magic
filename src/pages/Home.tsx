import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  X,
} from "lucide-react";
import "./home.css";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { assetUrl } from "@/utils/assetUrl";
import {
  hasAdminSession,
  subscribeToAdminSession,
} from "@/services/adminAccessService";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(hasAdminSession);

  useEffect(() => subscribeToAdminSession(() => setIsAdmin(hasAdminSession())), []);

  const primaryPhone = "+91 80126 86883";
  const primaryPhoneHref = "tel:+918012686883";
  const secondaryPhone = "+91 70109 68184";
  const secondaryPhoneHref = "tel:+917010968184";
  const kitchenAddress = "1B, Krishna Iyengar Street, Anaimalai";
  const kitchenMapUrl = "https://maps.app.goo.gl/zScEeCnzqjL7Viz47";

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
          <a href="#our-approach" onClick={() => setMobileMenuOpen(false)}>Our approach</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Our food</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
          <a href="#instagram" onClick={() => setMobileMenuOpen(false)}>From our kitchen</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <ThemeToggle className="home-theme-toggle" />
          <button className="home-nav-admin" onClick={() => { setMobileMenuOpen(false); navigate("/admin"); }}>
            {isAdmin ? "Admin dashboard" : "Admin login"}
          </button>
          {isAdmin && (
            <button className="home-button home-button-small" onClick={() => { setMobileMenuOpen(false); navigate("/menu-creator"); }}>
              Plan an event <ArrowRight size={16} />
            </button>
          )}
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
        <section className="home-hero" aria-label="BKR Catering introduction">
          <img
            className="home-hero-image"
            src={assetUrl("/home-catering-table.jpg")}
            alt=""
          />
          <div className="home-hero-copy">
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
            <div className="home-hero-actions">
              {isAdmin ? (
                <button className="home-button" onClick={() => navigate("/menu-creator")}>
                  Plan your event <ArrowRight size={17} />
                </button>
              ) : (
                <a className="home-button" href={primaryPhoneHref}>
                  Talk to our team <Phone size={17} />
                </a>
              )}
              <a className="home-text-link" href="#how-it-works">
                See how it works <ArrowDown size={15} />
              </a>
            </div>
            <div className="home-trust-note">
              <span className="home-check"><Check size={14} /></span>
              <span>Build your menu at your own pace. Save it and come back any time.</span>
            </div>
          </div>
          <a className="home-hero-scroll" href="#our-approach" aria-label="Scroll to our approach">
            <span>Scroll to discover</span><ArrowDown size={15} />
          </a>
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
            <a className="home-text-link" href="#how-it-works">
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
