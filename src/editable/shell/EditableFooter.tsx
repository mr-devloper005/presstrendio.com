'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const services = ['Press release routing', 'Newsroom publishing', 'Campaign pickup tracking', 'Media archive support', 'Source-ready briefs']

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const mediaRoute = SITE_CONFIG.taskViews.mediaDistribution || '/media-distribution'
  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Media Distribution', href: mediaRoute },
    { label: 'Search Archive', href: '/search' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-[#111a2c] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8">
          <form action="/signup" className="flex max-w-xl border border-[#f5bd2d] bg-white">
            <input name="email" type="email" placeholder="Your Email Here" className="min-w-0 flex-1 px-4 py-4 text-sm font-bold text-[#111a2c] outline-none placeholder:text-[#111a2c]/30" />
            <button className="inline-flex items-center gap-2 bg-[#08c9aa] px-5 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]"><ArrowRight className="h-4 w-4" /> Subscribe Now</button>
          </form>
          <h2 className="text-2xl font-black lg:text-3xl">Let&apos;s subscribe to our media distribution newsletter</h2>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_.65fr_.85fr] lg:px-8 lg:py-20">
        <div>
          <Link href="/" className="text-5xl font-black">
            <span>{SITE_CONFIG.name.slice(0, Math.max(1, Math.ceil(SITE_CONFIG.name.length / 2)))}</span><span className="text-[#f5bd2d]">{SITE_CONFIG.name.slice(Math.max(1, Math.ceil(SITE_CONFIG.name.length / 2)))}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/72">{globalContent.footer?.description || 'Media distribution, public updates, press releases, and campaign-ready newsroom content in one focused archive.'}</p>
          <div className="mt-7 flex gap-4 text-sm font-black text-[#f5bd2d]">
            
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black">Quick Links</h3>
          <div className="mt-6 grid gap-3">
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#f5bd2d]"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> {item.label}</Link>
            ))}
            {session ? (
              <>
                <Link href="/create" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#f5bd2d]"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> Create</Link>
                <button onClick={logout} className="inline-flex items-center gap-2 text-left text-sm font-bold hover:text-[#f5bd2d]"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> Logout {session.name}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#f5bd2d]"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> Log in</Link>
                <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#f5bd2d]"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> Sign up</Link>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black">Our Services</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {services.map((service) => (
              <span key={service} className="inline-flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-[#f5bd2d]" /> {service}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-sm font-bold text-white/80">Copyright © {year} {SITE_CONFIG.name}. All Rights Reserved.</div>
    </footer>
  )
}
