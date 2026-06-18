import Link from 'next/link'
import { Archive, BadgeCheck, RadioTower, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchSiteFeed, type SitePost } from '@/lib/site-connector'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage } from '@/editable/cards/PostCards'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const markers = [
  { icon: RadioTower, title: 'Distribution planning', body: 'Shape announcements so readers, partners, and outlets can understand the update fast.' },
  { icon: Archive, title: 'Campaign memory', body: 'Keep releases, source details, and related updates organized after launch day.' },
  { icon: ShieldCheck, title: 'Reliable access', body: 'Make the next action clear with consistent navigation, search, and contact routes.' },
]

const realPostImage = (posts: SitePost[], preferredIndex = 0) => {
  const images = posts.map((post) => getEditablePostImage(post)).filter(Boolean)
  return images[preferredIndex] || images[0] || ''
}

export default async function AboutPage() {
  const mediaRoute = SITE_CONFIG.taskViews.mediaDistribution || '/media-distribution'
  const feed = await fetchSiteFeed(24, { task: 'mediaDistribution', fresh: true, timeoutMs: 5000 }).catch(() => null)
  const image = realPostImage(feed?.posts || [])
  return (
    <EditableSiteShell>
      <main className="bg-[#f5f6f8] text-[#20242c]">
        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
            <div className="relative min-h-[460px] overflow-hidden bg-[#111a2c]">
              {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" /> : null}
              <div className="absolute left-0 top-0 bg-[#f5bd2d] p-7 text-[#111a2c]">
                <BadgeCheck className="h-8 w-8" />
                <p className="mt-2 text-5xl font-black">100</p>
                <p className="font-black">Media checks</p>
              </div>
            </div>
            <div className="bg-white p-0 lg:p-10">
              <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">{pagesContent.about.badge}</p>
              <h1 className="mt-7 text-5xl font-black leading-tight sm:text-6xl">{pagesContent.about.title}</h1>
              <p className="mt-6 text-lg font-bold leading-8 text-[#6f7480]">{pagesContent.about.description}</p>
              <div className="mt-7 grid gap-4 text-base leading-8 text-[#6f7480]">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={mediaRoute} className="bg-[#f5bd2d] px-7 py-3.5 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">Browse Media</Link>
                <Link href="/contact" className="border border-[#111a2c] px-7 py-3.5 text-xs font-black uppercase tracking-[.14em]">Contact Us</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#111a2c] text-white">
          <div className="mx-auto grid max-w-[1280px] gap-px bg-white/15 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {markers.map((item, index) => (
              <div key={item.title} className="bg-[#111a2c] p-8">
                <item.icon className="h-10 w-10 text-[#f5bd2d]" />
                <p className="mt-8 text-6xl font-black text-transparent [-webkit-text-stroke:2px_#f5bd2d]">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-black">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
            {pagesContent.about.values.map((value) => (
              <div key={value.title} className="bg-white p-7 shadow-[0_18px_45px_rgba(17,26,44,.10)]">
                <h2 className="text-2xl font-black">{value.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#6f7480]">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f5bd2d] text-[#111a2c]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h2 className="max-w-3xl text-4xl font-black leading-tight">Ready to distribute the next announcement from {SITE_CONFIG.name}?</h2>
            <Link href="/create" className="w-fit bg-[#111a2c] px-7 py-3.5 text-xs font-black uppercase tracking-[.14em] text-white">Create Update</Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
