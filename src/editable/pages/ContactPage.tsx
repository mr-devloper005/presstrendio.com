import { Globe2, Mail, MapPin, Megaphone, Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { fetchSiteFeed, type SitePost } from '@/lib/site-connector'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage } from '@/editable/cards/PostCards'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const contacts = [
  { icon: Phone, title: 'Phone Number', value: '0761-8523-398' },
  { icon: Mail, title: 'Email Address', value: `hello@${SITE_CONFIG.domain}` },
  { icon: Globe2, title: 'Website', value: SITE_CONFIG.domain },
  { icon: MapPin, title: 'Distribution Desk', value: 'Remote newsroom and campaign support' },
]

const realPostImage = (posts: SitePost[], preferredIndex = 1) => {
  const images = posts.map((post) => getEditablePostImage(post)).filter(Boolean)
  return images[preferredIndex] || images[0] || ''
}

export default async function ContactPage() {
  const feed = await fetchSiteFeed(24, { task: 'mediaDistribution', fresh: true, timeoutMs: 5000 }).catch(() => null)
  const image = realPostImage(feed?.posts || [])
  return (
    <EditableSiteShell>
      <main className="bg-white text-[#20242c]">
        <section className="bg-[#111a2c] text-white">
          <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-end lg:px-8 lg:py-20">
            <div>
              <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-7 text-5xl font-black leading-tight sm:text-6xl">{pagesContent.contact.title}</h1>
            </div>
            <p className="max-w-2xl border-l-4 border-[#f5bd2d] pl-5 text-base font-semibold leading-8 text-white/72">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="relative min-h-[300px] overflow-hidden bg-[#edf0f5] sm:col-span-2">
              {image ? <img src={"/favicon.png"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" /> : <img src={"/favicon.png"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65" />}
              <div className="absolute inset-0 bg-[#111a2c]/20" />
            </div>
            <div className="bg-[#111a2c] p-7 text-white sm:col-span-2">
              <Megaphone className="h-10 w-10 text-[#f5bd2d]" />
              <h2 className="mt-5 text-2xl font-black">Media distribution support</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">Send release details, source questions, corrections, or campaign partnership notes.</p>
            </div>
            {contacts.map((item) => (
              <div key={item.title} className="bg-[#111a2c] p-6 text-white">
                <item.icon className="h-8 w-8 text-[#f5bd2d]" />
                <h3 className="mt-4 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/78">{item.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Connect With Us</p>
            <h2 className="mt-6 text-5xl font-black leading-tight">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
