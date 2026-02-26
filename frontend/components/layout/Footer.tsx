import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Who We Serve', href: '/who-we-serve' },
      { label: 'Starting a Business', href: '/starting-a-business' },
      { label: 'Contact', href: '/contact' },
    ],
    services: [
      { label: 'Business Formation', href: '/services#formation' },
      { label: 'Websites & Domains', href: '/services#websites' },
      { label: 'Custom Applications', href: '/services#applications' },
      { label: 'AI Tools', href: '/services#ai' },
      { label: 'Email Infrastructure', href: '/services#email' },
      { label: 'Compliance Support', href: '/services#compliance' },
    ],
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white border-t border-blue-900/30 relative overflow-hidden">
      {/* Blue ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="container-custom py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Innovation</span>
                <span className="text-sm text-neutral-400">Business Development Solutions</span>
              </div>
            </Link>
            <p className="text-neutral-400 leading-relaxed max-w-md mb-6">
              National business scaling infrastructure. From multi-state licensing and formation to custom AI and digital growth, we build the systems you need to expand with confidence.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-5 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold mb-5 text-white">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/30 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-neutral-400 text-sm">
            © {currentYear} Innovation Business Development Solutions. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link
              href="/privacy"
              className="text-neutral-400 hover:text-white text-sm transition-all duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-neutral-400 hover:text-white text-sm transition-all duration-300"
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
