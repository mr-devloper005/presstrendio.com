import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Newspaper, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { fetchSiteFeed, type SiteFeedPagination, type SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const getImage = (post: SitePost) => getImages(post)[0] || ''
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const normalizeTypeToken = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const isMockPost = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media : []
  return (
    post.id?.includes('-mock-') ||
    post.authorName === 'Site Master Pro' ||
    media.some((item) => typeof item?.url === 'string' && item.url.includes('picsum.photos/seed/')) ||
    asText(content.website) === 'https://example.com'
  )
}

const postMatchesEditableTask = (post: SitePost, task: TaskKey) => {
  const taskConfig = getTaskConfig(task)
  const expected = [task, taskConfig?.contentType || ''].filter(Boolean).map((value) => normalizeTypeToken(String(value)))
  const content = getContent(post)
  const explicitType = asText(content.type)
  const typeToken = explicitType ? normalizeTypeToken(explicitType) : ''
  const tagTokens = Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string').map(normalizeTypeToken) : []
  if (typeToken) return expected.includes(typeToken)
  if (tagTokens.some((tag) => expected.includes(tag))) return true
  return task === 'mediaDistribution' && SITE_CONFIG.tasks.filter((item) => item.enabled).length === 1
}

const onlyRealTaskPosts = (posts: SitePost[], task: TaskKey, category: string) =>
  posts.filter((post) => {
    if (isMockPost(post)) return false
    if (!postMatchesEditableTask(post, task)) return false
    if (category === 'all') return true
    const postCategory = getCategory(post, '')
    return postCategory ? normalizeCategory(postCategory) === category : false
  })

const paginationForPosts = (page: number, limit: number, total: number): SiteFeedPagination => {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  }
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Newswire cards prioritize source, category, headline, and publication-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  let { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  posts = onlyRealTaskPosts(posts, task, category)

  if (!posts.length) {
    const fresh = await fetchPaginatedTaskPosts(task, { page, limit: 24, category, fresh: true })
    const freshPosts = onlyRealTaskPosts(fresh.posts, task, category)
    if (freshPosts.length) {
      posts = freshPosts
      pagination = fresh.pagination
    }
  }

  if (!posts.length) {
    const feed = await fetchSiteFeed(1000, { fresh: true, timeoutMs: 5000 }).catch(() => null)
    const allRealPosts = onlyRealTaskPosts(feed?.posts || [], task, category)
    const limit = 24
    const start = (page - 1) * limit
    posts = allRealPosts.slice(start, start + limit)
    pagination = paginationForPosts(page, limit, allRealPosts.length)
  }

  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="rounded-[2.5rem] border border-[var(--editable-border)] bg-[var(--archive-surface)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-70">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--editable-border)] bg-white/55 p-4 text-sm font-bold leading-7 opacity-75">{deck.promise}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Browse all</Link>
              <Link href="/search" className="rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-black">Search posts</Link>
            </div>
          </div>

          <form action={basePath} className="self-end rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Filter</div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[var(--editable-border)] bg-white px-4 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)]">Apply</button>
            <p className="mt-3 text-xs font-bold opacity-55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white/60 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const secondary = posts.slice(1, 3)
  const cardPosts = posts
  const itemHref = (post: SitePost) => post.slug ? `${basePath}/${post.slug}` : basePath

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f5f6f8] text-[#20242c]">
        <section className="relative overflow-hidden bg-[#111a2c] text-white">
          {lead && getImage(lead) ? <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
          <div className="absolute inset-0 bg-[#111a2c]/70" />
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f5bd2d]">The media desk</p>
              <h1 className="mt-3 text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
                {category === 'all' ? label : categoryLabel}
              </h1>
            </div>
            <p className="relative max-w-md border-l-4 border-[#f5bd2d] pl-5 text-sm font-bold leading-7 text-white/78">
              Press releases, campaign updates, and media-ready stories organized for fast discovery.
            </p>
          </div>
        </section>

        <section className="border-b border-[#111a2c]/10 bg-white text-[#111a2c]">
          <div className="mx-auto flex max-w-[1180px] gap-7 overflow-x-auto px-4 py-4 text-xs font-black uppercase tracking-[0.16em] sm:px-6 lg:px-8">
            <Link href={basePath} className={category === 'all' ? 'text-[#f5bd2d]' : 'hover:text-[#f5bd2d]'}>Latest</Link>
            {categories.slice(0, 8).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={category === item.slug ? 'text-[#f5bd2d]' : 'whitespace-nowrap hover:text-[#f5bd2d]'}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        {lead ? (
          <section className="mx-auto mt-12 grid max-w-[1180px] gap-6 px-4 sm:px-6 lg:grid-cols-[1.35fr_.75fr] lg:px-8">
            <Link href={itemHref(lead)} className="group relative min-h-[30rem] overflow-hidden bg-[#111a2c] shadow-[0_24px_70px_rgba(17,26,44,.16)]">
              {getImage(lead) ? <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <span className="bg-[#f5bd2d] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#111a2c]">{getCategory(lead, label)}</span>
                <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{lead.title}</h2>
                <p className="mt-5 max-w-2xl line-clamp-2 text-sm font-semibold leading-7 text-white/80">{getSummary(lead)}</p>
              </div>
            </Link>
            <div className="grid bg-[#111a2c] text-white">
              <div className="border-b border-white/15 bg-[#111a2c] p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.24em]">Top stories</p>
                <p className="mt-3 text-3xl font-black leading-tight">What the media desk is watching now.</p>
              </div>
              {secondary.map((post, index) => (
                <Link key={post.id || post.slug} href={itemHref(post)} className="group grid grid-cols-[7rem_1fr] border-b border-white/15 bg-[#111a2c] last:border-b-0">
                  {getImage(post) ? <img src={getImage(post)} alt="" className="h-full min-h-40 w-full object-cover transition group-hover:scale-105" /> : <div className="h-full min-h-40 w-full bg-[#263655]" />}
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f5bd2d]">0{index + 1}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="inline-flex bg-[#f5bd2d] px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[#111a2c]">Our Blog</p>
              <h2 className="mt-5 text-4xl font-black sm:text-5xl">Media Distribution Posts</h2>
            </div>
            <form action={basePath} className="flex border border-[#111a2c] bg-white">
              <select name="category" defaultValue={category} className="h-11 min-w-44 bg-transparent px-3 text-xs font-black uppercase outline-none">
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="h-11 bg-[#111a2c] px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Filter</button>
            </form>
          </div>

          {cardPosts.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {cardPosts.map((post, index) => (
                <Link key={post.id || post.slug} href={itemHref(post)} className="group bg-white shadow-[0_22px_55px_rgba(17,26,44,.10)]">
                  {getImage(post) ? (
                    <div className="aspect-[16/10] overflow-hidden bg-black">
                      <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-[#f5bd2d]">
                      <span>{getCategory(post, label)}</span><span>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black leading-tight">{post.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6f7480]">{getSummary(post)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : !lead ? (
            <div className="border border-dashed border-[#111a2c] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8" />
              <h2 className="mt-4 text-3xl font-black">No media updates found</h2>
              <p className="mt-2 text-sm text-black/60">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-center gap-0">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[#111a2c] bg-white px-5 py-3 text-xs font-black uppercase">Previous</Link> : null}
            <span className="border-y border-[#111a2c] bg-[#f5bd2d] px-5 py-3 text-xs font-black uppercase text-[#111a2c]">Page {page} / {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[#111a2c] bg-white px-5 py-3 text-xs font-black uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
        </div>
      ) : null}
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--archive-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-bg)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {image ? (
        <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      ) : null}
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--archive-text)] hover:text-[var(--archive-bg)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}
