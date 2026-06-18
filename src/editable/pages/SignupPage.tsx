import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, FileText, Megaphone } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f5f6f8] text-[#20242c]">
        <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-[1280px] px-4 py-12 sm:px-6 lg:grid-cols-[.9fr_1fr] lg:px-8">
          <div className="flex flex-col justify-center bg-white p-7 shadow-[0_22px_55px_rgba(17,26,44,.10)] sm:p-12 lg:p-16">
            <BadgeCheck className="h-10 w-10 text-[#f5bd2d]" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#6f7480]">Create account</p>
            <h1 className="mt-3 text-4xl font-black">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-5 border-t border-[#111a2c]/15 pt-5 text-sm text-[#6f7480]">Already have an account? <Link href="/login" className="font-black text-[#111a2c] underline decoration-[#f5bd2d] decoration-4 underline-offset-4">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div className="bg-[#111a2c] p-8 text-white sm:p-12 lg:p-16">
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-7 max-w-xl text-5xl font-black leading-tight sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-base font-semibold leading-8 text-white/72">{pagesContent.auth.signup.description}</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {[{ icon: Megaphone, label: 'Release publishing' }, { icon: FileText, label: 'Campaign drafts' }].map((item) => (
                <div key={item.label} className="border border-white/15 p-5">
                  <item.icon className="h-8 w-8 text-[#f5bd2d]" />
                  <p className="mt-4 text-sm font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
