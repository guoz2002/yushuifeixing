"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWeixin, FaYoutube } from "react-icons/fa6";
import { IoLogoTiktok } from "react-icons/io5";
import { SiXiaohongshu } from "react-icons/si";
import { useI18n } from "@/i18n";

export function FlyFooter() {
  const { t } = useI18n();
  const companyLinks = ["Maintenance", "Environment", "Legal", "Sales Recruitment", "Service Recruitment", "Battery Recycling"];
  const productLinks = [
    ["Y-3 Series", "/models/h1"],
    ["Y-5 Series", "/models/h2"],
    ["Technology", "/tech/advantages"],
    ["Configure", "/2d"],
    ["Test Ride", "/contact"],
  ];
  const socialLinks = [
    {
      href: "mailto:business@fly-h2o.cn",
      label: "Email",
      icon: <Mail size={27} strokeWidth={1.7} aria-hidden="true" />,
    },
    {
      href: "https://www.facebook.com/share/1Ccz5VK1vk/?mibextid=wwXIfr",
      label: "Facebook",
      icon: <FaFacebookF aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://www.instagram.com/alaqua_fly_h2o/",
      label: "Instagram",
      icon: <FaInstagram aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://www.linkedin.com/company/y-h2o/",
      label: "LinkedIn",
      icon: <FaLinkedinIn aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://weixin.qq.com/",
      label: "WeChat",
      icon: <FaWeixin aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://xhslink.com/m/5LKG4MpwYqA",
      label: "Xiaohongshu",
      icon: <SiXiaohongshu aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://www.youtube.com/@alaqua_fly-h2o",
      label: "YouTube",
      icon: <FaYoutube aria-hidden="true" />,
      external: true,
    },
    {
      href: "https://www.tiktok.com/@flyh2o/video/7632709594615188743?is_from_webapp=1&sender_device=pc",
      label: "TikTok",
      icon: <Image src="/tiktok-logo-text-white.jpg" alt="" width={120} height={27} className="socialTextMark" />,
      external: true,
    },
    {
      href: "https://www.douyin.com/user/MS4wLjABAAAAFh_waNM6-sK1xE2-MtxSBPzufV3_KuIo8YDcCcnArvsG3oTTPvEjwR65VJTeGYep?from_tab_name=main&vid=7460143316986793231",
      label: "Douyin",
      icon: <IoLogoTiktok aria-hidden="true" />,
      external: true,
    },
  ];

  return (
    <footer className="flyFooter" id="site-footer">
      <div className="footerShell">
        <div className="footerNavCluster">
          <div className="footerLinkColumns">
            <nav className="footerLinkColumn" aria-label={t("Company")}>
              {companyLinks.map((item) => (
                <Link href="/help-center" key={item}>
                  {t(item)}
                </Link>
              ))}
            </nav>
            <nav className="footerLinkColumn" aria-label={t("Products")}>
              {productLinks.map(([item, href]) => (
                <Link href={href} key={item}>
                  {t(item)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footerSocial" aria-label={t("Follow Us")}>
            {socialLinks.map((item) => (
              <a
                href={item.href}
                key={item.label}
                aria-label={item.label}
                title={item.label}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        <Link className="footerWordmark" href="/" aria-label="ALAQUA">
          ALAQUA
        </Link>
        <div className="footerContact">
          <form aria-label={t("Contact Us")}>
            <input aria-label={t("Full Name")} placeholder={t("Full Name")} />
            <input aria-label={t("Email or Phone")} placeholder={t("Email or Phone")} />
            <textarea aria-label={t("Message")} placeholder={t("Message")} />
            <button type="button">{t("SEND MESSAGE")}</button>
          </form>
        </div>
      </div>
      <div className="footerBrandText" aria-hidden="true">
        <Image src="/footer-brand-alaqua.png" alt="" width={1920} height={349} sizes="100vw" />
      </div>
    </footer>
  );
}
