"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaWeixin, FaYoutube } from "react-icons/fa6";
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
      href: "https://www.facebook.com/",
      label: "Facebook",
      icon: <FaFacebookF aria-hidden="true" />,
    },
    {
      href: "https://www.instagram.com/",
      label: "Instagram",
      icon: <FaInstagram aria-hidden="true" />,
    },
    {
      href: "https://www.linkedin.com/",
      label: "LinkedIn",
      icon: <FaLinkedinIn aria-hidden="true" />,
    },
    {
      href: "https://www.wechat.com/",
      label: "WeChat",
      icon: <FaWeixin aria-hidden="true" />,
    },
    {
      href: "https://www.xiaohongshu.com/",
      label: "Xiaohongshu",
      icon: <SiXiaohongshu aria-hidden="true" />,
      text: "小红书",
    },
    {
      href: "https://www.youtube.com/",
      label: "YouTube",
      icon: <FaYoutube aria-hidden="true" />,
    },
    {
      href: "https://www.tiktok.com/",
      label: "TikTok",
      icon: <FaTiktok aria-hidden="true" />,
    },
    {
      href: "https://www.douyin.com/",
      label: "Douyin",
      icon: <FaTiktok aria-hidden="true" />,
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
              <a className={item.text ? "hasText" : ""} href={item.href} key={item.label} aria-label={item.label}>
                {item.text ? <span>{item.text}</span> : item.icon}
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
        ALAQUA
      </div>
    </footer>
  );
}
