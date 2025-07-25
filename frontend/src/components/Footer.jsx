// import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

// const socialLinks = [
//   { href: "https://discord.com", icon: <FaDiscord /> },
//   { href: "https://twitter.com", icon: <FaTwitter /> },
//   { href: "https://youtube.com", icon: <FaYoutube /> },
//   { href: "https://medium.com", icon: <FaMedium /> },
// ];

// const Footer = () => {
//   return (
//     <footer className="w-screen bg-[#2c5abb] py-4 text-black">
//       <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
//         <p className="text-center text-sm font-light md:text-left">
//           ©Avyra 2024. All rights reserved
//         </p>

//         <div className="flex justify-center gap-4  md:justify-start">
//           {socialLinks.map((link, index) => (
//             <a
//               key={index}
//               href={link.href}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-black transition-colors duration-500 ease-in-out hover:text-white"
//             >
//               {link.icon}
//             </a>
//           ))}
//         </div>

//         <a
//           href="#privacy-policy"
//           className="text-center text-sm font-light hover:underline md:text-right"
//         >
//           Privacy Policy
//         </a>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

const Footer = () => (
  <footer
    className="w-full bg-gradient-to-tr from-[#111729] via-[#15204b] to-[#090c22] border-t border-[#222748] py-6 px-4 text-gray-300 shadow-inner mt-12"
  >
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left - Logo and Name */}
      <div className="flex items-center gap-3">
        <img src="/img/logo.png" alt="Avyra Logo" className="w-8 sm:w-10 rounded drop-shadow-glow" />
        <span className="text-xl sm:text-2xl font-extrabold fancy-gradient-text tracking-wider select-none">
          AVYRA
        </span>
      </div>

      {/* Center - Copyright */}
      <div className="text-sm text-gray-400 order-3 sm:order-2 text-center">
        © {new Date().getFullYear()} Avyra Game Download Platform. All Rights Reserved.
      </div>

      {/* Right - Static nav and policy link */}
      <div className="flex gap-5 order-2 sm:order-3 items-center">
        <a
          href="/help"
          className="hover:text-indigo-400 duration-150 transition-colors text-sm font-medium"
        >
          Help
        </a>
        <a
          href="/terms"
          className="hover:text-indigo-400 duration-150 transition-colors text-sm font-medium"
        >
          Terms
        </a>
        <a
          href="/privacy-policy"
          className="hover:text-indigo-400 duration-150 transition-colors text-sm font-medium"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
