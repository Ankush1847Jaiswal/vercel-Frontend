import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-saffron to-primary-700 rounded-lg flex items-center justify-center">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-lg leading-tight">UPSC Saarthi</div>
                <div className="text-xs text-gray-400 leading-tight">Civil Services Prep</div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your trusted companion for UPSC Civil Services Examination preparation. Comprehensive resources, expert guidance, and structured study plans.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: 'YouTube',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  label: 'Twitter',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  href: '#',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-navy-light flex items-center justify-center hover:bg-saffron hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Study Resources</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Prelims Preparation', href: '/study-materials#prelims' },
                { label: 'Mains Preparation', href: '/study-materials#mains' },
                { label: 'General Studies Notes', href: '/study-materials#gs' },
                { label: 'NCERT Materials', href: '/study-materials#ncert' },
                { label: 'Previous Year Papers', href: '/study-materials#pyq' },
                { label: 'Answer Writing Practice', href: '/study-materials#answer-writing' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-saffron transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Exam Info</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'UPSC Prelims Syllabus', href: '/syllabus#prelims' },
                { label: 'UPSC Mains Syllabus', href: '/syllabus#mains' },
                { label: 'Optional Subjects', href: '/syllabus#optional' },
                { label: 'Current Affairs', href: '/current-affairs' },
                { label: 'Mock Tests', href: '/mock-tests' },
                { label: 'Study Planner', href: '/syllabus#planner' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-saffron transition-colors flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Important Links</h3>
            <ul className="space-y-3 mb-6">
              {[
                { label: 'UPSC Official Website', href: 'https://upsc.gov.in', external: true },
                { label: 'UPSC Exam Calendar', href: 'https://upsc.gov.in', external: true },
                { label: 'NCERT e-Books', href: 'https://ncert.nic.in', external: true },
                { label: 'PIB India', href: 'https://pib.gov.in', external: true },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-saffron transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink size={12} className="shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="bg-navy-light rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-saffron shrink-0" />
                <span>support@upscsaarthi.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {year} UPSC Saarthi. All rights reserved. For educational purposes only.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
