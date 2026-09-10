import { Link } from "react-router-dom";
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
} from "lucide-react";

export const Footer = () => {
    return (
        <footer className="w-full border-t border-border/50 bg-card/60 backdrop-blur-md relative overflow-hidden transition-colors mt-auto">
            {/* Ambient subtle background decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Banner: Value Proposition & Newsletter/Status */}
            <div className="border-b border-border/40 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                <ShieldCheck className="size-3.5" />
                                ICA Cooperative Principles Compliant
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                                <CircleDot className="size-2.5 text-emerald-500 animate-pulse" />
                                Operational
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">
                            Empowering Gig Workers Through Cooperative Ownership
                        </h3>
                        <p className="text-xs text-muted-foreground max-w-xl">
                            100% transparent bidding, guaranteed floor wages, group health insurance, and collective bargaining for skilled tradesmen across India.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            to="/register/worker"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-98"
                        >
                            <Wrench className="size-3.5" />
                            Join as Worker
                        </Link>
                        <Link
                            to="/register/cooperative"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border/80 bg-input/20 hover:bg-input/40 text-foreground transition-all active:scale-98"
                        >
                            <Building2 className="size-3.5" />
                            Affiliate Co-op
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer Links Columns */}
            <div className="py-12 px-4 sm:px-8 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 text-xs">
                {/* Col 1: Brand & Mission */}
                <div className="space-y-4 sm:col-span-2 lg:col-span-2">
                    <Link to="/" className="inline-flex items-center gap-2.5 group select-none">
                        <div className="size-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs">
                            <Handshake className="size-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight flex items-center leading-none">
                                <span className="text-foreground">fair</span>
                                <span className="text-primary font-extrabold ml-0.5">gig</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                                Cooperative Platform
                            </span>
                        </div>
                    </Link>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">
                        FairGig is India's premier multi-stakeholder cooperative network uniting customers, trade professionals, and worker cooperatives for transparent, dignified labor.
                    </p>
                    <div className="space-y-2 text-muted-foreground pt-1">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-3.5 text-primary shrink-0" />
                            <span>Cooperative Apex Center, Institutional Area, New Delhi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="size-3.5 text-primary shrink-0" />
                            <span>Toll-free: +91 1800-FAIR-GIG (24/7 Helpline)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="size-3.5 text-primary shrink-0" />
                            <span>secretariat@fairgig.coop</span>
                        </div>
                    </div>
                </div>

                {/* Col 2: Platform Roles & Portals */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground tracking-tight flex items-center gap-1.5">
                        <Globe className="size-3.5 text-primary" />
                        Portals & Roles
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>
                            <Link to="/" className="hover:text-foreground hover:underline transition-colors flex items-center gap-1">
                                Customer Marketplace
                            </Link>
                        </li>
                        <li>
                            <Link to="/register/worker" className="hover:text-foreground hover:underline transition-colors flex items-center gap-1">
                                Worker Pro Portal
                                <ArrowUpRight className="size-3 text-muted-foreground" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/register/cooperative" className="hover:text-foreground hover:underline transition-colors flex items-center gap-1">
                                Cooperative Societies
                                <ArrowUpRight className="size-3 text-muted-foreground" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-foreground hover:underline transition-colors flex items-center gap-1">
                                Help & Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin" className="hover:text-foreground hover:underline transition-colors flex items-center gap-1">
                                Administration Console
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Col 3: Popular Trade Services */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground tracking-tight flex items-center gap-1.5">
                        <Wrench className="size-3.5 text-primary" />
                        Trade Services
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                Electrical Installations
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                Plumbing & Sanitation
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                Carpentry & Woodwork
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                Commercial Painting
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                Solar & Renewable Power
                            </Link>
                        </li>
                        <li>
                            <Link to="/categories" className="hover:text-foreground hover:underline transition-colors">
                                HVAC & Deep Cleaning
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Col 4: Trust, Governance & Standards */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground tracking-tight flex items-center gap-1.5">
                        <Landmark className="size-3.5 text-primary" />
                        Governance & Trust
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                        <li>
                            <span className="hover:text-foreground transition-colors cursor-pointer">
                                Fair Gig Wage Standard
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-foreground transition-colors cursor-pointer">
                                Worker Welfare & Insurance
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-foreground transition-colors cursor-pointer">
                                Cooperative Dispute Protocol
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-foreground transition-colors cursor-pointer">
                                Accreditation & Safety Audits
                            </span>
                        </li>
                        <li>
                            <span className="hover:text-foreground transition-colors cursor-pointer">
                                Democratic Member Voting
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar: Copyright & Legal */}
            <div className="border-t border-border/40 py-6 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 text-center sm:text-left">
                    <span>© {new Date().getFullYear()} FairGig Cooperative Platform.</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1 justify-center">
                        Empowering trade labor with <Heart className="size-3 text-destructive fill-destructive" /> across India.
                    </span>
                </div>

                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <span className="hover:text-foreground hover:underline cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-foreground hover:underline cursor-pointer">Terms of Service</span>
                    <span className="hover:text-foreground hover:underline cursor-pointer">Wage Transparency</span>
                    <span className="hover:text-foreground hover:underline cursor-pointer">Cooperative Bylaws</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
