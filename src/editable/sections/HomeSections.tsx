import Link from 'next/link'
import { Archive, ArrowRight, BadgeCheck, Boxes, Megaphone, Search, ShieldCheck, TrendingUp, UploadCloud } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const capabilities = [
  { icon: Megaphone, title: 'Press Release Distribution', body: 'Package company announcements for fast public discovery.' },
  { icon: Archive, title: 'Media Archive Management', body: 'Keep published updates searchable by campaign and category.' },
  { icon: UploadCloud, title: 'Source-Ready Publishing', body: 'Attach images, links, and details that make posts easier to reuse.' },
]

const trustPoints = ['Outlet-ready formatting', 'Campaign archive clarity', 'Fast search and filtering', 'Creator access controls']
const stats = [
  { value: '9k', label: 'Best Reviews', icon: BadgeCheck },
  { value: '32+', label: 'Campaign Channels', icon: Boxes },
  { value: '95%', label: 'Archive Uptime', icon: TrendingUp },
]

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function fallbackImage(posts: SitePost[], index = 0) {
  return posts[index] ? getEditablePostImage(posts[index]) : ''
}

function brandHeroImage() {
  const brand = SITE_CONFIG.name.replace(/[<>&"']/g, '')
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#111a2c"/>
          <stop offset="0.56" stop-color="#263655"/>
          <stop offset="1" stop-color="#111a2c"/>
        </linearGradient>
        <pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse">
          <path d="M90 0H0v90" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="2"/>
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)"/>
      <rect width="1600" height="900" fill="url(#grid)"/>
      <g opacity=".96">
        <rect x="980" y="128" width="330" height="190" fill="#f5bd2d"/>
        <rect x="1040" y="186" width="210" height="76" fill="#111a2c" opacity=".92"/>
        <rect x="1110" y="318" width="330" height="190" fill="#ffffff" opacity=".9"/>
        <rect x="1170" y="376" width="210" height="76" fill="#263655"/>
        <rect x="860" y="356" width="330" height="190" fill="#08c9aa" opacity=".88"/>
        <rect x="920" y="414" width="210" height="76" fill="#111a2c" opacity=".9"/>
        <rect x="1032" y="546" width="330" height="190" fill="#f5bd2d" opacity=".95"/>
        <rect x="1092" y="604" width="210" height="76" fill="#111a2c" opacity=".92"/>
      </g>
      <g fill="none" stroke="#f5bd2d" stroke-width="8" opacity=".75">
        <path d="M760 300h165M760 452h92M760 604h210"/>
        <circle cx="730" cy="300" r="16"/>
        <circle cx="730" cy="452" r="16"/>
        <circle cx="730" cy="604" r="16"/>
      </g>
      <g>
        <rect x="190" y="235" width="475" height="92" fill="#f5bd2d"/>
        <text x="222" y="296" fill="#111a2c" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="900">${brand}</text>
        <text x="190" y="390" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900">Media Distribution</text>
        <text x="194" y="456" fill="#ffffff" opacity=".72" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700">Press releases, public updates, and campaign-ready stories</text>
      </g>
    </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function HomeTextCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block min-h-[240px] w-[260px] shrink-0 snap-start bg-white p-6 shadow-[0_18px_45px_rgba(17,26,44,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(17,26,44,.14)]">
      <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[.18em] text-[#f5bd2d]">
        <span>{getEditableCategory(post)}</span>
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-5 line-clamp-3 text-2xl font-black leading-tight text-[#20242c] group-hover:text-[#111a2c]">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm font-semibold leading-7 text-[#6f7480]">{getEditableExcerpt(post, 170)}</p>
      <span className="mt-5 inline-flex text-xs font-black uppercase tracking-[.16em] text-[#111a2c]">Read update</span>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const heroTitle = pagesContent.home.hero.title.join(' ')
  const postImage = lead ? getEditablePostImage(lead) : ''
  const image = postImage || brandHeroImage()

  return (
    <section className="bg-white">
      <div className="relative min-h-[620px] overflow-hidden bg-[#111a2c] text-white">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,26,44,.96)_0%,rgba(17,26,44,.74)_45%,rgba(17,26,44,.25)_100%)]" />
        <div className={`${dc.shell.section} relative flex min-h-[620px] items-center py-20`}>
          <div className="max-w-3xl border-l-4 border-[#f5bd2d] pl-6">
            <p className="text-xs font-black uppercase tracking-[.24em] text-[#f5bd2d]">{pagesContent.home.hero.badge}</p>
            <h1 className="mt-5 text-5xl font-black leading-[.98] sm:text-6xl lg:text-7xl">{lead?.title || heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">{lead ? getEditableExcerpt(lead, 180) : pagesContent.home.hero.description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={primaryRoute} className={dc.button.accent}>Browse Media <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/about" className="bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">About Us</Link>
            </div>
          </div>
        </div>
      </div>
      <div className={`${dc.shell.section} -mt-8 relative z-10 grid gap-5 lg:grid-cols-3`}>
        {capabilities.map((item, index) => (
          <Link key={item.title} href={primaryRoute} className={`min-h-36 p-7 shadow-[0_22px_50px_rgba(17,26,44,.18)] ${index === 2 ? 'bg-[#f5bd2d] text-[#111a2c]' : 'bg-[#263655] text-white'}`}>
            <div className="relative flex items-start gap-4">
              <item.icon className="h-10 w-10 shrink-0" />
              <div>
                <h2 className="text-2xl font-black leading-tight">{item.title}</h2>
                <p className={`mt-2 text-sm font-semibold leading-6 ${index === 2 ? 'text-[#111a2c]/75' : 'text-white/75'}`}>{item.body}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(1, 9).length ? posts.slice(1, 9) : posts
  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
          <div>
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Storage Service Company</p>
            <h2 className="mt-8 text-4xl font-black leading-tight text-[#20242c] sm:text-5xl">Media distribution built for campaign teams</h2>
          </div>
          <div>
            <p className="text-base leading-8 text-[#6f7480]">Use {SITE_CONFIG.name} to organize press releases, distribute company updates, and keep every announcement easy to search after it goes live.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="border-l-4 border-[#f5bd2d] bg-[#f7f8fa] p-5">
                  <item.icon className="h-7 w-7 text-[#f5bd2d]" />
                  <p className="mt-3 text-3xl font-black text-[#111a2c]">{item.value}</p>
                  <p className="text-sm font-black">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {railPosts.length ? (
          <div className={`${dc.layout.rail} mt-12`}>
            {railPosts.map((post, index) => <HomeTextCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[0]
  return (
    <section className="bg-[#111a2c] text-white">
      <div className="grid lg:grid-cols-2">
        <div className="flex min-h-[520px] items-center">
          <div className="mx-auto w-full max-w-[640px] px-6 py-16 lg:px-10">
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Why Choose Us</p>
            <h2 className="mt-8 text-5xl font-black leading-tight">Why trust us with your media distribution</h2>
            <p className="mt-6 text-base leading-8 text-white/78">We keep announcements organized, searchable, and visually consistent so readers can act on the right information quickly.</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {trustPoints.map((point, index) => (
                <div key={point} className="grid grid-cols-[76px_1fr] items-center gap-4">
                  <span className="text-6xl font-black leading-none text-transparent [-webkit-text-stroke:2px_#f5bd2d]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-black leading-tight">{point}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href={feature ? postHref(primaryTask, feature, primaryRoute) : primaryRoute} className="relative min-h-[520px] overflow-hidden bg-[#263655]">
          {fallbackImage(posts, 2) ? <img src={fallbackImage(posts, 2)} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
        </Link>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = (collected.length ? collected : posts).slice(0, 6)
  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden">
            {fallbackImage(posts, 3) ? <img src={fallbackImage(posts, 3)} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
            <div className="absolute left-0 top-0 bg-[#f5bd2d] p-7 text-[#111a2c]">
              <BadgeCheck className="h-8 w-8" />
              <p className="mt-2 text-5xl font-black">100</p>
              <p className="font-black">Campaign checks</p>
            </div>
          </div>
          <div className="bg-white p-0 lg:p-10">
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">About Us</p>
            <h2 className="mt-7 text-4xl font-black leading-tight text-[#20242c] sm:text-5xl">How we became a trusted distribution partner</h2>
            <p className="mt-6 text-base leading-8 text-[#6f7480]">The site is shaped for media teams that need a clean way to publish announcements, preserve context, and route visitors toward the next useful action.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about" className={dc.button.accent}>More About Us</Link>
              <Link href={primaryRoute} className="border border-[#111a2c] px-7 py-3.5 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">Open Archive</Link>
            </div>
          </div>
        </div>

        {source.length ? (
          <div className="mt-16">
            <div className="mb-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div>
                <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Our Blog</p>
                <h2 className="mt-6 text-4xl font-black text-[#20242c]">The Latest News</h2>
              </div>
              <p className="max-w-xl text-base leading-8 text-[#6f7480]">Recent {taskLabel(primaryTask).toLowerCase()} updates, campaign announcements, and source-ready media posts.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {source.slice(0, 4).map((post) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group min-h-[230px] bg-white p-6 shadow-[0_18px_50px_rgba(17,26,44,.10)] transition duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[.18em] text-[#f5bd2d]">
                    <span>{getEditableCategory(post)}</span>
                    <span>Read</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black leading-tight text-[#20242c]">{post.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#6f7480]">{getEditableExcerpt(post, 150)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <form action="/search" className="mt-14 grid gap-5 bg-[#111a2c] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <h3 className="text-3xl font-black">Search the full media archive</h3>
            <p className="mt-2 text-sm text-white/65">Explore every {taskLabel(primaryTask).toLowerCase()} published by {SITE_CONFIG.name}.</p>
          </div>
          <label className="flex border border-[#f5bd2d] bg-white sm:min-w-[430px]">
            <Search className="ml-4 mt-4 h-4 w-4 text-[#111a2c]" />
            <input name="q" placeholder="Search media updates" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-bold text-[#111a2c] outline-none" />
            <button className="bg-[#f5bd2d] px-5 text-xs font-black uppercase tracking-[.14em] text-[#111a2c]">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="relative overflow-hidden bg-[#111a2c] text-white">
      <div className={`${dc.shell.section} grid gap-10 py-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-20`}>
        <div>
          <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Connect With Us</p>
          <h2 className="mt-7 text-5xl font-black leading-tight">Need more media reach? We&apos;ve got you covered.</h2>
        </div>
        <div>
          <p className="text-lg leading-8 text-white/72">Send your announcement details, campaign goals, or distribution questions and keep your next release moving with a focused media workflow.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className={dc.button.accent}>Book Now</Link>
            <Link href="/create" className="border border-white/50 px-7 py-3.5 text-xs font-black uppercase tracking-[.14em] hover:bg-white hover:text-[#111a2c]">Create Update</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
