import React from "react";
import { useNavigate } from "react-router-dom";
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
  Utensils,
  ExternalLink,
} from "lucide-react";
import "./home.css";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-nav">
        <a className="home-brand" href="/" aria-label="BKR Catering home">
          <img src="/bkr-catering-reference.png" alt="BKR Catering" />
          <span>Good food, warmly served.</span>
        </a>
        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#our-approach">Our approach</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
          <ThemeToggle className="home-theme-toggle" />
          <button className="home-nav-admin" onClick={() => navigate("/admin")}>
            Admin
          </button>
          <button className="home-button home-button-small" onClick={() => navigate("/menu-creator")}>
            Plan an event <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-eyebrow"><span /> Anaimalai · Tamil Nadu</p>
            <h1>
              A good celebration
              <br />
              starts <em>at the table.</em>
            </h1>
            <p className="home-intro">
              Thoughtful South Indian menus, planned around your people, your
              traditions and the moments you want to remember.
            </p>
            <div className="home-hero-actions">
              <button className="home-button" onClick={() => navigate("/menu-creator")}>
                Plan your event <ArrowRight size={17} />
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
          <div className="home-hero-art" aria-label="BKR Catering, serving Anaimalai">
            <div className="home-art-topline">A little care in every detail</div>
            <div className="home-art-rule" />
            <img src="/bkr-catering-reference.png" alt="" />
            <div className="home-art-caption">
              <span>MENUS FOR MOMENTS THAT MATTER</span>
              <strong>Made with care.<br />Shared with joy.</strong>
            </div>
            <span className="home-art-seal"><Utensils size={18} /></span>
          </div>
        </section>

        <section className="home-intro-strip" id="our-approach">
          <p className="home-section-kicker">A simpler way to plan</p>
          <h2>From first details to a menu worth sharing.</h2>
          <p>
            One clear place to organise your event, choose dishes for every
            gathering and prepare a polished menu in English or Tamil.
          </p>
        </section>

        <section className="home-steps" id="how-it-works">
          <article className="home-step-card">
            <span className="home-step-number">01</span>
            <CalendarDays aria-hidden="true" />
            <h3>Tell us about the day</h3>
            <p>Add your venue, dates and guest count. Planning a few days? Add a session for each one.</p>
          </article>
          <article className="home-step-card">
            <span className="home-step-number">02</span>
            <MenuIcon aria-hidden="true" />
            <h3>Choose what to serve</h3>
            <p>Browse familiar South Indian favourites and build a different menu for every session.</p>
          </article>
          <article className="home-step-card">
            <span className="home-step-number">03</span>
            <FileText aria-hidden="true" />
            <h3>Review and share</h3>
            <p>Check your details, add your rates and download a neat PDF or editable Word menu.</p>
          </article>
        </section>

        <section className="home-instagram" id="instagram">
          <div className="home-instagram-copy">
            <p className="home-section-kicker">From our kitchen</p>
            <h2>See what we’re serving.</h2>
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
            <p className="home-section-kicker">Your menu, your way</p>
            <h2>Ready when you are.</h2>
            <p>Start with the event details. You can save your work and return to it later.</p>
          </div>
          <button className="home-button home-button-light" onClick={() => navigate("/menu-creator")}>
            Start planning <ArrowRight size={17} />
          </button>
        </section>
      </main>

      <footer className="home-footer" id="contact">
        <div className="home-footer-brand">
          <img src="/bkr-catering-reference.png" alt="BKR Catering" />
          <p>Good food brings people together.</p>
        </div>
        <div className="home-footer-contact">
          <p><MapPin size={16} /> Anaimalai, Tamil Nadu</p>
          <a href="tel:+918248846225"><Phone size={16} /> +91 82488 46225</a>
          <a href="mailto:info@bkrcatering.com">info@bkrcatering.com</a>
        </div>
        <span className="home-copyright">© 2026 BKR Catering</span>
      </footer>
    </div>
  );
};

export default Home;
