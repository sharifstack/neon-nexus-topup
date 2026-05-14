import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-dim dark:bg-surface-dim border-t border-outline-variant/30 w-full py-xxl mt-auto">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-4 gap-xl">
        {/* Brand Column */}
        <div className="flex flex-col gap-md">
          <span className="font-headline-md text-headline-md italic text-primary">NEON NEXUS</span>
          <p className="font-body-md text-body-md text-on-surface-variant">The elite destination for premium gaming top-ups and digital assets.</p>
        </div>
        {/* Links Column */}
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-md text-label-md text-primary mb-md uppercase">Legal</h4>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary hover:text-tertiary transition-colors duration-200" href="#">Privacy Policy</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary hover:text-tertiary transition-colors duration-200" href="#">Terms of Service</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary hover:text-tertiary transition-colors duration-200" href="#">Refund Policy</Link>
        </div>
        {/* Links Column 2 */}
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-md text-label-md text-primary mb-md uppercase">Support</h4>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary hover:text-tertiary transition-colors duration-200" href="#">Contact Us</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary hover:text-tertiary transition-colors duration-200" href="#">FAQ</Link>
        </div>
        {/* Newsletter Column */}
        <div>
          <h4 className="font-label-md text-label-md text-primary mb-md uppercase">Newsletter</h4>
          <div className="flex mt-sm">
            <input className="bg-[#050506] border border-outline-variant/50 text-on-surface rounded-l-lg px-md py-sm w-full input-focus font-body-md text-body-md" placeholder="Enter email" type="email" />
            <button className="bg-primary-container text-on-primary-container px-md py-sm rounded-r-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-gutter mt-xl pt-md border-t border-outline-variant/10">
        <p className="font-label-sm text-label-sm text-outline text-center">© 2024 Neon Nexus. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
