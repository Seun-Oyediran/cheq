'use client';
import React from 'react';
import { BoxLogo, Discord, Github, LogoText, Twitter } from './svgs/icons';
import { footerData } from '@/lib/utils/static';
import { motion } from 'framer-motion';

interface IFooterItem {
  item: (typeof footerData)[0];
}

interface IAnimatedBoxLogo {
  target: number;
  index: number;
}

function AnimatedBoxLogo(props: IAnimatedBoxLogo) {
  const { target = 0.2, index } = props;

  return (
    <motion.div
      // drag="y"
      // dragConstraints={{ top: 0, bottom: 0 }}
      className="bg-white"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.125 0H5.46875C5.90022 0 6.25 0.349778 6.25 0.78125V1.25C6.25 1.42259 6.38991 1.5625 6.5625 1.5625C6.73509 1.5625 6.875 1.42259 6.875 1.25V0.78125C6.875 0.349778 7.22478 0 7.65625 0H12.4357C12.8164 0 13.125 0.308627 13.125 0.689338V1.25C13.125 1.42259 13.2649 1.5625 13.4375 1.5625C13.6101 1.5625 13.75 1.42259 13.75 1.25V0.689338C13.75 0.308627 14.0586 0 14.4393 0H17.3958C18.8341 0 20 1.16593 20 2.60417V5.33854C20 5.84193 19.5919 6.25 19.0885 6.25H18.75C18.5774 6.25 18.4375 6.38991 18.4375 6.5625C18.4375 6.73509 18.5774 6.875 18.75 6.875H19.2188C19.6502 6.875 20 7.22478 20 7.65625V12.3438C20 12.7752 19.6502 13.125 19.2188 13.125H18.75C18.5774 13.125 18.4375 13.2649 18.4375 13.4375C18.4375 13.6101 18.5774 13.75 18.75 13.75H19.2188C19.6502 13.75 20 14.0998 20 14.5312V16.875C20 18.6009 18.6009 20 16.875 20H14.5312C14.0998 20 13.75 19.6502 13.75 19.2188V18.75C13.75 18.5774 13.6101 18.4375 13.4375 18.4375C13.2649 18.4375 13.125 18.5774 13.125 18.75V19.2188C13.125 19.6502 12.7752 20 12.3438 20H7.65625C7.22478 20 6.875 19.6502 6.875 19.2188V18.75C6.875 18.5774 6.73509 18.4375 6.5625 18.4375C6.38991 18.4375 6.25 18.5774 6.25 18.75V19.2188C6.25 19.6502 5.90022 20 5.46875 20H3.125C1.39911 20 0 18.6009 0 16.875V14.5312C0 14.0998 0.349778 13.75 0.78125 13.75H1.25C1.42259 13.75 1.5625 13.6101 1.5625 13.4375C1.5625 13.2649 1.42259 13.125 1.25 13.125H0.78125C0.349778 13.125 0 12.7752 0 12.3438V7.65625C0 7.22478 0.349778 6.875 0.78125 6.875H1.25C1.42259 6.875 1.5625 6.73509 1.5625 6.5625C1.5625 6.38991 1.42259 6.25 1.25 6.25H0.78125C0.349778 6.25 0 5.90022 0 5.46875V3.125C0 1.39911 1.39911 0 3.125 0ZM8.78759 3.10551L5.13632 5.18096C4.306 5.65294 3.7931 6.53445 3.7931 7.48954V11.7824C3.7931 12.7299 4.29803 13.6057 5.11808 14.0805L8.76934 16.1944C9.59234 16.6708 10.6073 16.6708 11.4303 16.1944L15.0816 14.0805C15.9016 13.6057 16.4065 12.7299 16.4065 11.7824V7.48954C16.4065 6.53445 15.8936 5.65294 15.0633 5.18096L11.4121 3.10551C10.5984 2.64299 9.60128 2.64299 8.78759 3.10551ZM7.2452 8.00246C6.80523 8.00246 6.44857 8.35913 6.44857 8.7991V9.99406C6.44857 10.434 6.80523 10.7907 7.2452 10.7907C7.68518 10.7907 8.04184 10.434 8.04184 9.99406V8.7991C8.04184 8.35913 7.68518 8.00246 7.2452 8.00246ZM12.1578 8.7991C12.1578 8.35913 12.5145 8.00246 12.9544 8.00246C13.3944 8.00246 13.7511 8.35913 13.7511 8.7991V9.99406C13.7511 10.434 13.3944 10.7907 12.9544 10.7907C12.5145 10.7907 12.1578 10.434 12.1578 9.99406V8.7991Z"
          initial={{
            fill: `rgba(40,40,40,${target})`,
          }}
          animate={{
            fill: `rgba(40,40,40,1)`,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: 0.2 * 1.5 * index,
          }}
        />
      </svg>
    </motion.div>
  );
}

function FooterItem(props: IFooterItem) {
  const { item } = props;

  return (
    <div className="app_footer__item flex flex-col gap-3">
      <p className="app_footer__item__text__bold">{item.title}</p>

      {item?.items?.map((child) => (
        <a key={child.id} href={child.path}>
          <p className="app_footer__item__text">{child.label}</p>
        </a>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <div className="app_footer">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4 app_footer__left">
          <div className="flex items-center gap-2">
            <BoxLogo />
            <LogoText />
          </div>
          <p className="app_footer__left__details">
            Cheq.com provides information and resources about the fundamentals of the decentralized,
            user-driven PVP betting platform called the Cheq Protocol, built on a foundation of
            open-source, self-executing smart contracts deployed across various permissionless
            public blockchains. The cheq Protocol enables secure and transparent betting experiences
            using memecoins as stakes. Cheq Labs does not control or operate any version of the Cheq
            Protocol on any blockchain network. Users engage with the Protocol at their own
            discretion and are encouraged to fully understand the associated risks.
          </p>
        </div>

        <div className="flex gap-12">
          {footerData.map((item) => (
            <FooterItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 app_footer__social">
        <p className="app_footer__social__text">&copy; 2022</p>

        <div className="flex items-center gap-2">
          <a href="#">
            <Github />
          </a>

          <a href="#">
            <Twitter />
          </a>

          <a href="#">
            <Discord />
          </a>
        </div>
      </div>

      <div className="app_footer__logos">
        <div className="flex justify-center items-center gap-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <AnimatedBoxLogo key={index} target={0.2} index={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
