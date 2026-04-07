// BreadBoxd.jsx
// A Letterboxd-style recipe tracking app homepage.
// Uses only Tailwind utility classes (no custom CSS needed).
// Swap out placeholder emoji images for real <img> tags as needed.

export default function BreadBoxd() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Navbar />
      <Hero />
      <main>
        <PopularRecipes />
        <div className="border-t border-stone-200" />
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-10">
            <ActivityFeed />
            <YourStats />
          </div>
          <Sidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-lg font-medium text-stone-800">
        <div className="w-7 h-7 bg-orange-700 rounded-md flex items-center justify-center text-sm">
          🍞
        </div>
        BreadBoxd
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm text-stone-500">
        {["Discover", "My Recipes", "Lists", "Community"].map((link) => (
          <a key={link} href="#" className="hover:text-stone-800 transition-colors">
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="text-sm px-4 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
          Log in
        </button>
        <button className="text-sm px-4 py-2 rounded-lg bg-orange-700 text-white hover:bg-orange-800 transition-colors">
          Sign up
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="bg-stone-100 border-b border-stone-200 px-6 py-14 text-center">
      <p className="text-xs font-medium tracking-widest text-orange-700 uppercase mb-3">
        Your kitchen, your story
      </p>
      <h1 className="text-3xl font-medium text-stone-800 leading-snug mb-3">
        Track, review & discover<br />recipes you love
      </h1>
      <p className="text-sm text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
        Log every dish you've cooked, rate your favorites, and find your next
        culinary adventure — like Letterboxd, but for food.
      </p>
      <div className="flex gap-3 justify-center">
        <button className="px-6 py-2.5 bg-orange-700 text-white rounded-lg text-sm font-medium hover:bg-orange-800 transition-colors">
          Start cooking
        </button>
        <button className="px-6 py-2.5 border border-stone-200 bg-white rounded-lg text-sm hover:bg-stone-50 transition-colors">
          Browse recipes
        </button>
      </div>
    </div>
  );
}

// ─── Popular Recipes ────────────────────────────────────────────────────────

const popularRecipes = [
  { emoji: "🍝", bg: "bg-orange-50",  title: "Cacio e Pepe",    rating: "★★★★★", logs: "2.4k logs" },
  { emoji: "🍜", bg: "bg-amber-50",   title: "Tonkotsu Ramen",  rating: "★★★★½", logs: "1.8k logs" },
  { emoji: "🥘", bg: "bg-red-50",     title: "Chicken Tagine",  rating: "★★★★☆", logs: "1.2k logs" },
  { emoji: "🥗", bg: "bg-green-50",   title: "Panzanella",      rating: "★★★★☆", logs: "980 logs"  },
];

function PopularRecipes() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium text-stone-800">🔥 Popular this week</h2>
        <a href="#" className="text-xs text-orange-700 hover:underline">See all →</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {popularRecipes.map((r) => (
          <RecipeCard key={r.title} {...r} />
        ))}
      </div>
    </section>
  );
}

function RecipeCard({ emoji, bg, title, rating, logs }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-stone-300 transition-colors">
      <div className={`${bg} h-28 flex items-center justify-center text-4xl`}>
        {emoji}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-stone-800 mb-1">{title}</p>
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span className="text-orange-600">{rating}</span>
          <span>{logs}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Feed ──────────────────────────────────────────────────────────

const activities = [
  {
    initials: "JK", avatarBg: "bg-orange-100", avatarText: "text-orange-800",
    text: <><strong>Jamie K.</strong> logged <strong>Sourdough Focaccia</strong> and rated it ★★★★★</>,
    time: "20 min ago",
  },
  {
    initials: "SR", avatarBg: "bg-green-100", avatarText: "text-green-800",
    text: <><strong>Sara R.</strong> added <strong>Miso Glazed Salmon</strong> to her "Weeknight Wins" list</>,
    time: "1 hr ago",
  },
  {
    initials: "TM", avatarBg: "bg-indigo-100", avatarText: "text-indigo-800",
    text: <><strong>Tom M.</strong> reviewed <strong>Beef Bourguignon</strong> — "Worth every hour of prep."</>,
    time: "3 hr ago",
  },
  {
    initials: "LL", avatarBg: "bg-pink-100", avatarText: "text-pink-800",
    text: <><strong>Laura L.</strong> logged <strong>Shakshuka</strong> for the 4th time this month</>,
    time: "Yesterday",
  },
];

function ActivityFeed() {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-base font-medium text-stone-800">👥 Friend activity</h2>
        <a href="#" className="text-xs text-orange-700 hover:underline">Follow more →</a>
      </div>
      <div className="flex flex-col gap-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${a.avatarBg} ${a.avatarText}`}>
              {a.initials}
            </div>
            <div>
              <p className="text-sm text-stone-500 leading-relaxed">{a.text}</p>
              <p className="text-xs text-stone-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Your Stats ─────────────────────────────────────────────────────────────

const cuisineTags = ["Italian", "Japanese", "Mexican", "Thai", "French", "Indian"];

function YourStats() {
  return (
    <div>
      <h2 className="text-base font-medium text-stone-800 mb-4">📊 Your stats</h2>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { num: "142", label: "Recipes logged" },
          { num: "38",  label: "Unique cuisines" },
          { num: "12",  label: "Lists made" },
        ].map((s) => (
          <div key={s.label} className="bg-stone-100 rounded-lg p-3 text-center">
            <p className="text-2xl font-medium text-stone-800">{s.num}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-400 mb-2">Your most-cooked cuisines</p>
      <div className="flex flex-wrap gap-1.5">
        {cuisineTags.map((tag) => (
          <span key={tag} className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

const trending = [
  { rank: "#1", name: "White miso",  count: "3.2k uses" },
  { rank: "#2", name: "Nduja",       count: "2.8k uses" },
  { rank: "#3", name: "Yuzu",        count: "2.1k uses" },
  { rank: "#4", name: "Sumac",       count: "1.9k uses" },
  { rank: "#5", name: "Tamarind",    count: "1.6k uses" },
];

const suggested = [
  { emoji: "🫕", bg: "bg-orange-50", title: "Birria Tacos",  reason: "Based on your Mexican logs" },
  { emoji: "🍱", bg: "bg-green-50",  title: "Bento Bowl",    reason: "Popular with your friends" },
];

function Sidebar() {
  return (
    <aside className="flex flex-col gap-8 pt-1">
      {/* Trending ingredients */}
      <div>
        <h2 className="text-base font-medium text-stone-800 mb-3">📈 Trending ingredients</h2>
        <div className="flex flex-col gap-2">
          {trending.map((t) => (
            <div key={t.rank} className="flex items-center gap-3 px-3 py-2 bg-stone-100 rounded-lg cursor-pointer hover:bg-stone-200 transition-colors">
              <span className="text-xs font-medium text-orange-700 w-5">{t.rank}</span>
              <span className="text-sm font-medium text-stone-800 flex-1">{t.name}</span>
              <span className="text-xs text-stone-400">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested for you */}
      <div>
        <h2 className="text-base font-medium text-stone-800 mb-3">✨ Suggested for you</h2>
        <div className="flex flex-col gap-3">
          {suggested.map((s) => (
            <div key={s.title} className="flex bg-white border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-stone-300 transition-colors">
              <div className={`w-14 h-14 flex-shrink-0 flex items-center justify-center text-2xl ${s.bg}`}>
                {s.emoji}
              </div>
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-stone-800">{s.title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 px-6 py-5 flex items-center justify-between text-xs text-stone-400">
      <span>© 2026 BreadBoxd</span>
      <div className="flex gap-4">
        {["About", "Blog", "Privacy", "Terms"].map((l) => (
          <a key={l} href="#" className="hover:text-stone-600 transition-colors">{l}</a>
        ))}
      </div>
    </footer>
  );
}
