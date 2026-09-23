import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Handshake,
  ShieldCheck,
  Heart,
  Globe,
  Mail,
  Phone,
  MapPin,
  CircleDot,
  Wrench,
  Building2,
  Landmark,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative w-full bg-[#0A1624] text-slate-300 overflow-hidden border-t border-slate-800/80 mt-auto select-none">
      {/* Subtle Top Gradient Highlight Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#168C83] to-transparent opacity-80" />

      {/* Ambient Radial Background Glows */}
      <div className="absolute -top-32 -left-32 size-96 rounded-full bg-[#168C83]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-[#17324D]/30 blur-3xl pointer-events-none" />

      {/* 1. Top Enterprise Callout Bar */}
      {/* Mobile Compact Trust Strip */}
      <div className="sm:hidden border-b border-white/[0.07] bg-white/[0.02] px-4 py-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
            <ShieldCheck className="size-3.5 text-[#5EEAD4]" />
            {t("footer.trustStripPrinciple")}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t("footer.livePlatform")}
          </span>
        </div>
      </div>

      {/* Desktop / Tablet Enterprise Callout Bar */}
      <div className="hidden sm:block border-b border-white/[0.07] bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            {/* Left Info & Trust Badges */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#168C83]/15 text-[#5EEAD4] border border-[#168C83]/30 shadow-xs">
                  <ShieldCheck className="size-3 text-[#5EEAD4]" />
                  {t("footer.trustStripPrinciple")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("footer.liveOperational")}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {t("footer.empoweringHeadline")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {t("footer.empoweringDesc")}
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
              <Link to="/register/worker" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#168C83] to-[#13796F] text-white shadow-md shadow-[#168C83]/25 hover:from-[#13796F] hover:to-[#0F635B] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Wrench className="size-3.5" />
                  <span>{t("footer.joinWorker")}</span>
                  <ArrowUpRight className="size-3.5 opacity-80" />
                </button>
              </Link>
              <Link to="/register/cooperative" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
                >
                  <Building2 className="size-3.5" />
                  <span>{t("footer.affiliateCoop")}</span>
                  <ArrowUpRight className="size-3.5 opacity-80" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand & Contact Overview */}
          <div className="md:col-span-12 lg:col-span-4 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
              <div className="size-8 rounded-xl bg-gradient-to-br from-[#168C83] to-[#17324D] text-white flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-md shadow-[#168C83]/20 border border-white/15">
                <Handshake className="size-4.5 text-[#5EEAD4]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight flex items-center leading-none">
                  <span className="text-white">fair</span>
                  <span className="text-[#5EEAD4] ml-0.5">gig</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                  {t("nav.cooperativePlatform")}
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t("footer.platformDesc")}
            </p>

            {/* Mobile Contact Quick-Pills */}
            <div className="flex sm:hidden flex-wrap items-center gap-2 pt-0.5">
              <a
                href="tel:18003247444"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 transition-colors border border-white/10"
              >
                <Phone className="size-3 text-[#5EEAD4]" />
                <span>1800-FAIR-GIG</span>
              </a>
              <a
                href="mailto:secretariat@fairgig.coop"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-slate-200 transition-colors border border-white/10"
              >
                <Mail className="size-3 text-[#5EEAD4]" />
                <span>{t("footer.support")}</span>
              </a>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 ml-1">
                <MapPin className="size-3 text-[#5EEAD4]/80" />
                <span>New Delhi</span>
              </span>
            </div>

            {/* Desktop / Tablet Contact Info */}
            <div className="hidden sm:block space-y-2 pt-1 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="size-3.5 text-[#5EEAD4] shrink-0 mt-0.5" />
                <span>{t("footer.newDelhi")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-[#5EEAD4] shrink-0" />
                <a
                  href="tel:18003247444"
                  className="hover:text-white hover:underline transition-colors font-semibold text-slate-300"
                >
                  {t("footer.helplineTitle")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-[#5EEAD4] shrink-0" />
                <a
                  href="mailto:secretariat@fairgig.coop"
                  className="hover:text-white hover:underline transition-colors text-slate-300"
                >
                  secretariat@fairgig.coop
                </a>
              </div>
            </div>
          </div>

          {/* Links Section: 2 cols on mobile, 3 cols on tablet/desktop */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-4 lg:pt-0 border-t border-white/[0.07] lg:border-0">
            {/* Column 1: Roles & Portals */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Globe className="size-3.5 text-[#5EEAD4]" />
                <span>{t("footer.portalsAndRoles")}</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.marketplace")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.allTradeServices")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register/worker"
                    className="text-slate-400 hover:text-[#5EEAD4] hover:translate-x-0.5 transition-all inline-flex items-center gap-1 py-0.5 group"
                  >
                    <span>{t("footer.workerPortal")}</span>
                    <ArrowUpRight className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register/cooperative"
                    className="text-slate-400 hover:text-[#5EEAD4] hover:translate-x-0.5 transition-all inline-flex items-center gap-1 py-0.5 group"
                  >
                    <span>{t("footer.coopSociety")}</span>
                    <ArrowUpRight className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.helpContact")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-slate-400 hover:text-[#5EEAD4] hover:translate-x-0.5 transition-all inline-flex items-center gap-1 py-0.5 group"
                  >
                    <span>{t("footer.apexAdmin")}</span>
                    <ArrowUpRight className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Trade Domains */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Wrench className="size-3.5 text-[#5EEAD4]" />
                <span>{t("footer.tradeDomains")}</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link
                    to="/services?q=Electrical"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.electricalWiring")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?q=Plumbing"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.plumbingPipework")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?q=Carpentry"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.carpentryFurniture")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?q=Painting"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.wallWoodPainting")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?priceType=hourly"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.hourlyGigs")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services?priceType=meters"
                    className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5"
                  >
                    {t("footer.meteredGigs")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Cooperative Standards (Hidden on mobile as requested, visible on tablet/desktop) */}
            <div className="hidden sm:block space-y-2.5">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Landmark className="size-3.5 text-[#5EEAD4]" />
                <span>{t("footer.trustGovernance")}</span>
              </h4>

              <ul className="space-y-1.5 text-xs">
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5 cursor-pointer">
                    {t("footer.floorWageStandards")}
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5 cursor-pointer">
                    {t("footer.ombudsmanProtocol")}
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5 cursor-pointer">
                    {t("footer.guildCert")}
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5 cursor-pointer">
                    {t("footer.welfareFundTrans")}
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-white hover:translate-x-0.5 transition-all block py-0.5 cursor-pointer">
                    {t("footer.genAssembly")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Strip */}
      <div className="border-t border-white/[0.07] py-3 sm:py-3.5 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-[11px] sm:text-xs">
            <span>&copy; {new Date().getFullYear()} {t("footer.copyright")}</span>
            <span className="hidden sm:inline text-slate-600">&bull;</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              {t("footer.builtWithLove")} <Heart className="size-3 text-rose-500 fill-rose-500 inline ml-1" />
            </span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center text-[11px] sm:text-xs font-medium">
            <span className="hover:text-white hover:underline transition-colors cursor-pointer">
              {t("footer.privacy")}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="hover:text-white hover:underline transition-colors cursor-pointer">
              {t("footer.terms")}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="hover:text-white hover:underline transition-colors cursor-pointer">
              {t("footer.tariffs")}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="hover:text-white hover:underline transition-colors cursor-pointer">
              {t("footer.bylaws")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
