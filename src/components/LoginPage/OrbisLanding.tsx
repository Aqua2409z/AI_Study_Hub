import { Mail, Twitter, Github, ChevronRight } from "lucide-react";
import Footer from "./Footer";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4";
const ABOUT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4";
const CTA_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4";

const NFTS = [
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4",
    score: "8.7/10",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4",
    score: "9/10",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4",
    score: "8.2/10",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4",
    score: "9.5/10",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4",
    score: "8.9/10",
  },
  {
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4",
    score: "9.2/10",
  },
];

const NAV_ITEMS = [
  { name: "HOMEPAGE", id: "homepage" },
  { name: "OBJECTIVES", id: "objectives" },
  { name: "CREATORS", id: "creators" },
  { name: "OUR JOURNEY", id: "our-journey" },
];

function SocialBtn({ Icon, className = "" }: { Icon: typeof Mail; className?: string }) {
  return (
    <button
      className={`liquid-glass rounded-[1rem] w-14 h-14 flex items-center justify-center text-cream hover:bg-white/10 transition ${className}`}
    >
      <Icon size={20} />
    </button>
  );
}

export default function OrbisLanding() {
  
  // 🛠️ Tinh chỉnh hàm cuộn mượt kết hợp đẩy định danh id lên thanh URL ẩn danh
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      
      // Đẩy hashtag lên URL mà không làm trình duyệt bị giật màn hình đột ngột
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="bg-space text-cream font-mono">
      {/* SECTION 1 — HERO (HOMEPAGE) */}
      <section id="homepage" className="relative w-full min-h-screen overflow-hidden rounded-b-[32px]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={HERO_VIDEO}
        />
        <div className="relative max-w-[1831px] mx-auto px-5 sm:px-8 lg:px-14 py-6 min-h-screen flex flex-col">
          <header className="flex items-center justify-between">
            <span className="font-grotesk text-[16px] uppercase tracking-wider">Orbis.Nft</span>
            <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
              <ul className="flex gap-10">
                {NAV_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleScroll(e, item.id)}
                      className="font-grotesk text-[13px] uppercase tracking-wider hover:text-neon transition"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="hidden lg:flex flex-col gap-3">
              <SocialBtn Icon={Mail} />
              <SocialBtn Icon={Twitter} />
              <SocialBtn Icon={Github} />
            </div>
          </header>

          <div className="flex-1 flex items-end pb-20 lg:pb-32">
            <div className="relative lg:ml-32 max-w-[780px]">
              <h1 className="font-grotesk uppercase text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] leading-[1.05] sm:leading-[1]">
                Beyond earth
                <br />
                and ( its ) familiar boundaries
              </h1>
              <span className="font-condiment text-neon text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] absolute -right-2 lg:right-8 top-2 -rotate-1 opacity-90 mix-blend-exclusion">
                Nft collection
              </span>
            </div>
          </div>

          <div className="flex lg:hidden justify-center gap-3 pb-10">
            <SocialBtn Icon={Mail} />
            <SocialBtn Icon={Twitter} />
            <SocialBtn Icon={Github} />
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT (OBJECTIVES) */}
      <section id="objectives" className="relative w-full min-h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={ABOUT_VIDEO}
        />
        <div className="relative max-w-[1831px] mx-auto px-5 sm:px-8 lg:px-14 py-16 lg:py-24 min-h-screen flex flex-col justify-between gap-16">
          <div className="flex flex-col lg:flex-row justify-between gap-10">
            <div className="relative">
              <h2 className="font-grotesk uppercase text-[32px] sm:text-[44px] lg:text-[60px] leading-[1]">
                Hello!
                <br />
                I'm orbis
              </h2>
              <span className="font-condiment text-neon text-[36px] sm:text-[52px] lg:text-[68px] absolute -bottom-4 right-0 -rotate-3 mix-blend-exclusion">
                Orbis
              </span>
            </div>
            <p className="font-mono text-[14px] lg:text-[16px] uppercase text-cream max-w-[266px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and
              silence in space
            </p>
          </div>

          <div className="flex flex-row justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-[266px]">
              <p className="font-mono text-[14px] uppercase opacity-10 text-[#010828] lg:text-cream">
                A digital object fixed beyond time and place.
              </p>
              <p className="font-mono text-[14px] uppercase opacity-10 text-[#010828] lg:text-cream">
                A digital object fixed beyond time and place.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-4 max-w-[266px]">
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                A digital object fixed beyond time and place.
              </p>
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                A digital object fixed beyond time and place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — GRID (CREATORS) */}
      <section id="creators" className="bg-space py-20 lg:py-28">
        <div className="max-w-[1831px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 mb-12">
            <h2 className="font-grotesk uppercase text-[32px] sm:text-[44px] lg:text-[60px] leading-[1]">
              Collection of
              <br />
              <span className="ml-12 md:ml-24 lg:ml-32 inline-block">
                <span className="font-condiment text-neon normal-case">Space</span> objects
              </span>
            </h2>
            <div className="flex flex-col items-end">
              <div className="flex items-end gap-3 font-grotesk uppercase">
                <span className="text-[32px] sm:text-[48px] lg:text-[60px] leading-none">SEE</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[20px] sm:text-[28px] lg:text-[36px]">ALL</span>
                  <span className="text-[20px] sm:text-[28px] lg:text-[36px]">CREATORS</span>
                </div>
              </div>
              <div className="bg-neon w-full h-[6px] lg:h-[10px] mt-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NFTS.map((n, index) => (
              <div
                key={`nft-item-${index}-${n.score}`}
                className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition"
              >
                <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    src={n.src}
                  />
                  <div className="absolute left-3 right-3 bottom-3 liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-cream/70 font-mono uppercase">
                        Rarity Score:
                      </span>
                      <span className="text-[16px] font-grotesk">{n.score}</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50 hover:scale-110 transition flex items-center justify-center text-white">
                      <ChevronRight size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA (OUR JOURNEY) */}
      <section id="our-journey" className="relative w-full min-h-screen flex items-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={CTA_VIDEO}
        />
        <div className="relative z-10 w-full max-w-[1831px] mx-auto px-5 sm:px-8 lg:px-14 py-20 min-h-screen flex flex-col justify-between">
          <div className="w-full flex justify-end pt-[5%]">
            <div className="relative text-right max-w-[850px]">
              <span className="font-condiment text-neon text-[24px] sm:text-[48px] lg:text-[68px] absolute -top-8 -left-6 lg:-top-14 lg:-left-14 -rotate-3 mix-blend-exclusion">
                Go beyond
              </span>
              <h2 className="font-grotesk uppercase text-[20px] sm:text-[38px] lg:text-[60px] leading-[1.05] text-[#F5F2EA]">
                <span className="block mb-4 lg:mb-8">JOIN US.</span>
                REVEAL WHAT'S HIDDEN.
                <br />
                DEFINE WHAT'S NEXT.
                <br />
                FOLLOW THE SIGNAL.
              </h2>
            </div>
          </div>

          <div className="flex justify-start pb-[5%]">
            <div className="liquid-glass rounded-[0.75rem] lg:rounded-[1.25rem] flex flex-col overflow-hidden">
              {[Mail, Twitter, Github].map((Icon, i) => (
                <button
                  key={i}
                  className={`flex items-center justify-center text-cream hover:bg-white/10 transition w-[16vw] sm:w-[10rem] lg:w-[12rem] h-[14vw] sm:h-[3.5rem] lg:h-[4.5rem] ${
                    i < 2 ? "border-b border-white/10" : ""
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER COMPONENT ==================== */}
      <Footer />
    </div>
  );
}