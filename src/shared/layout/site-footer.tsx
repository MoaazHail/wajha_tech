import {
  FOOTER_SERVICE_LINKS,
  MAIN_NAV,
} from "@/shared/lib/constants/navigation.constant";
import { EMAIL_HREF, PHONE_HREF, SITE } from "@/shared/lib/constants/site.constant";
import { Shell } from "@/shared/layout/shell";
import { Logo } from "@/shared/ui/logo";
import {
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/shared/ui/icons";

const SOCIAL = [
  { label: "يوتيوب", Icon: YoutubeIcon },
  { label: "لينكدإن", Icon: LinkedinIcon },
  { label: "إكس", Icon: XIcon },
  { label: "إنستغرام", Icon: InstagramIcon },
] as const;

const linkClass = "text-white/70 transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="bg-night px-gutter pb-[clamp(18px,2vw,28px)] text-white">
      <Shell>
        <div className="grid gap-[clamp(24px,3vw,44px)] pb-[clamp(28px,3.2vw,46px)] [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
          <div>
            <Logo size={34} compact className="text-white" />
            <p className="mt-4 max-w-[22ch] text-[14.5px] leading-[1.85] text-white/70">
              {SITE.tagline}
            </p>
          </div>

          <nav aria-label="روابط سريعة">
            <h2 className="text-base font-semibold">روابط سريعة</h2>
            <div className="mt-3.5 grid gap-2.5 text-[14.5px]">
              {MAIN_NAV.map((item) => (
                <a key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <h2 className="text-base font-semibold">تواصل معنا</h2>
            <div className="mt-3.5 grid gap-2.5 text-[14.5px] text-white/70">
              <a href={PHONE_HREF} dir="ltr" className={`${linkClass} text-end font-mono tracking-[.02em]`}>
                {SITE.phone}
              </a>
              <a href={EMAIL_HREF} dir="ltr" className={`${linkClass} text-end font-mono`}>
                {SITE.email}
              </a>
              <span>{SITE.address}</span>
            </div>

            <div className="mt-[18px] flex gap-2.5">
              {SOCIAL.map(({ label, Icon }) => (
                <a
                  key={label}
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="خدماتنا">
            <h2 className="text-base font-semibold">خدماتنا</h2>
            <div className="mt-3.5 grid gap-2.5 text-[14.5px]">
              {FOOTER_SERVICE_LINKS.map((item) => (
                <a key={item.label} href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="border-t border-white/12 pt-[clamp(14px,1.6vw,22px)] text-center text-[13.5px] text-white/60">
          جميع الحقوق محفوظة © {SITE.foundedYear} {SITE.name}
        </div>
      </Shell>
    </footer>
  );
}
