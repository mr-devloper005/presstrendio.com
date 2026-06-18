import type { Metadata } from 'next'
import Link from 'next/link'
import { Archive, LockKeyhole, RadioTower } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f5f6f8] text-[#20242c]">
        <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-[1280px] gap-0 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8">
          <div className="bg-[#111a2c] p-8 text-white sm:p-12 lg:p-16">
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-7 max-w-xl text-5xl font-black leading-tight sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-white/72">{pagesContent.auth.login.description}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[{ icon: RadioTower, label: 'Distribution access' }, { icon: Archive, label: 'Saved media desk' }].map((item) => (
                <div key={item.label} className="border border-white/15 p-5">
                  <item.icon className="h-8 w-8 text-[#f5bd2d]" />
                  <p className="mt-4 text-sm font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center bg-white p-7 shadow-[0_22px_55px_rgba(17,26,44,.10)] sm:p-12 lg:p-16">
            <LockKeyhole className="h-10 w-10 text-[#f5bd2d]" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#6f7480]">Member access</p>
            <h2 className="mt-3 text-4xl font-black">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 border-t border-[#111a2c]/15 pt-5 text-sm text-[#6f7480]">New here? <Link href="/signup" className="font-black text-[#111a2c] underline decoration-[#f5bd2d] decoration-4 underline-offset-4">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
