import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Who We Serve', href: '/who-we-serve' },
      { label: 'Industries', href: '/industries' },
      { label: 'Contact', href: '/contact' },
    ],
    services: [
      { label: 'Business Formation', href: '/services#formation' },
      { label: 'Growth Infrastructure', href: '/services#websites' },
      { label: 'Custom Applications', href: '/services#applications' },
      { label: 'AI Systems', href: '/services#ai' },
      { label: 'Compliance Support', href: '/services#compliance' },
    ],
    resources: [
      { label: 'Starting a Business', href: '/starting-a-business' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <div className="flex flex-col">
                <span className="text-xl font-serif font-normal tracking-wide">Innovation</span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">Business Development Solutions</span>
              </div>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              National business infrastructure firm. Formation, licensing, digital systems, and compliance — coordinated as one integrated platform across all 50 states.
            </p>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-300 mb-5">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-300 mb-5">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-neutral-300 mb-5">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compliance Disclaimer */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <p className="text-xs text-neutral-500 leading-relaxed max-w-4xl">
            Innovation Business Development Solutions provides business formation, infrastructure, and operational support services. 
            We do not provide legal advice, tax advice, or accounting services. Entity selection and compliance requirements vary by state 
            and industry. Consult with qualified legal and tax professionals for advice specific to your situation.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-neutral-500 text-xs">
            &copy; {currentYear} Innovation Business Development Solutions. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-neutral-500 hover:text-neutral-300 text-xs transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
