'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Mail, Menu, Search, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const mediaRoute = SITE_CONFIG.taskViews.mediaDistribution || '/media-distribution'
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'News', href: mediaRoute },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white text-[#111a2c] shadow-[0_1px_0_rgba(17,26,44,.12)]">
      <div className="border-b border-[#111a2c]/10 bg-[#f7f8fa]">
        <div className="mx-auto flex min-h-10 max-w-[1280px] items-center justify-between gap-4 px-4 text-xs font-extrabold sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden h-5 w-px bg-[#111a2c]/15 sm:block" />
            
          </div>
          <div className="hidden items-center gap-3 text-[#111a2c]/75 md:flex">
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-[82px] max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-3xl font-black tracking-normal sm:text-5xl" aria-label={`${SITE_CONFIG.name} home`}>
          <span className="text-[#20242c]">{SITE_CONFIG.name.slice(0, Math.max(1, Math.ceil(SITE_CONFIG.name.length / 2)))}</span>
          <span className="text-[#f5bd2d]">{SITE_CONFIG.name.slice(Math.max(1, Math.ceil(SITE_CONFIG.name.length / 2)))}</span>
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-black hover:text-[#f5bd2d]">{item.label}</Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <form action="/search" className="hidden h-11 items-center border border-[#111a2c]/15 bg-[#f7f8fa] xl:flex">
            <Search className="ml-3 h-4 w-4 text-[#111a2c]/45" />
            <input name="q" type="search" placeholder="Search media" className="w-40 bg-transparent px-3 text-sm font-bold outline-none placeholder:text-[#111a2c]/35" />
          </form>
          {session ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/create" className="bg-[#f5bd2d] px-5 py-3 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">Create</Link>
              <span className="inline-flex max-w-36 items-center gap-2 truncate text-xs font-black uppercase tracking-[.12em]"><UserRound className="h-4 w-4" /> {session.name}</span>
              <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] hover:text-[#f5bd2d]"><LogOut className="h-4 w-4" /> Logout</button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="px-2 py-3 text-xs font-black uppercase tracking-[.12em] hover:text-[#f5bd2d]">Log in</Link>
              <Link href="/signup" className="bg-[#f5bd2d] px-5 py-3 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">Sign up</Link>
            </div>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center border border-[#111a2c]/20 lg:hidden" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[#111a2c]/10 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-[1280px] gap-px bg-[#111a2c]/12">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="bg-white px-4 py-3 text-sm font-black">{item.label}</Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="bg-white px-4 py-3 text-sm font-black">Create</Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="bg-white px-4 py-3 text-left text-sm font-black">Logout {session.name}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="bg-white px-4 py-3 text-sm font-black">Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="bg-white px-4 py-3 text-sm font-black">Sign up</Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
