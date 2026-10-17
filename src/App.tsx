import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import {
  BookOpen,
  Bookmark,
  Check,
  ChevronDown,
  CirclePlus,
  Compass,
  Heart,
  Home,
  Menu,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Youtube,
  Headphones,
  ScrollText,
  Users,
  Star,
  Clock3,
} from 'lucide-react';

type Category =
  | 'All'
  | 'Quran'
  | 'Hadith'
  | 'Nasheed'
  | 'Seerah'
  | 'Prophets'
  | 'Learning';
type Post = {
  id: string;
  title: string;
  creator: string;
  category: Category;
  description: string;
  source: string;
  videoUrl?: string;
  likes?: number;
  duration?: string;
  color: string;
};
const categories: Category[] = [
  'All',
  'Quran',
  'Hadith',
  'Nasheed',
  'Seerah',
  'Prophets',
  'Learning',
];
const starterPosts: Post[] = [
  {
    id: 'quran-1',
    title: 'A moment with the Qur’an',
    creator: 'Quran Reflections',
    category: 'Quran',
    description:
      'Make space in your day to listen, reflect, and return to the words of Allah.',
    source: 'Add a verified recitation video to play the full audio.',
    likes: 2480,
    duration: 'Short reflection',
    color: 'emerald',
  },
  {
    id: 'hadith-1',
    title: 'Actions are judged by intentions',
    creator: 'Hadith Notes',
    category: 'Hadith',
    description:
      'A foundational hadith about sincerity and the intention behind our deeds.',
    source: 'Sahih al-Bukhari, Hadith 1; also narrated in Sahih Muslim.',
    likes: 1860,
    duration: '1 min read',
    color: 'sand',
  },
  {
    id: 'seerah-1',
    title: 'The people who stood firm',
    creator: 'Seerah Stories',
    category: 'Seerah',
    description:
      'Learn about the companions of the Prophet ﷺ and the lessons we can draw from their lives.',
    source:
      'Educational overview. Consult reliable Seerah works for detailed sourcing.',
    likes: 1320,
    duration: 'Story',
    color: 'blue',
  },
  {
    id: 'nasheed-1',
    title: 'A quiet moment of remembrance',
    creator: 'Nasheed Corner',
    category: 'Nasheed',
    description:
      'Discover vocal nasheed and reminders that encourage gratitude and good character.',
    source: 'Add a licensed audio or video source before playing media.',
    likes: 980,
    duration: 'Audio',
    color: 'rose',
  },
  {
    id: 'prophets-1',
    title: 'Patience in the story of Prophet Yusuf',
    creator: 'Stories of the Prophets',
    category: 'Prophets',
    description:
      'Reflect on patience, trust in Allah, and the way hardship can lead to relief.',
    source:
      'Qur’an 12; verify translations and tafsir with trusted scholarship.',
    likes: 2210,
    duration: 'Story',
    color: 'violet',
  },
  {
    id: 'learn-1',
    title: 'Small deeds, lasting impact',
    creator: 'Daily Deen',
    category: 'Learning',
    description:
      'Build a steady habit of learning, good manners, and beneficial action.',
    source: 'General reminder; consult trusted sources for religious rulings.',
    likes: 760,
    duration: 'Reminder',
    color: 'gold',
  },
];
const categoryIcon: Record<Category, typeof BookOpen> = {
  All: Compass,
  Quran: BookOpen,
  Hadith: ScrollText,
  Nasheed: Headphones,
  Seerah: Users,
  Prophets: Star,
  Learning: Sparkles,
};
function App() {
  const [posts, setPosts] = useState<Post[]>(starterPosts);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeNav, setActiveNav] = useState<'For you' | 'Explore' | 'Saved'>(
    'For you'
  );
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState('');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [category, setCategory] = useState<Category>('Quran');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/api/posts')
      .then(({ data }) => {
        if (Array.isArray(data.posts) && data.posts.length)
          setPosts(data.posts);
      })
      .catch(() =>
        setNotice(
          'Showing the starter library while the community feed reconnects.'
        )
      );
  }, []);

  const visiblePosts = useMemo(
    () =>
      posts.filter(post => {
        const categoryMatch =
          activeCategory === 'All' || post.category === activeCategory;
        const navMatch = activeNav !== 'Saved' || saved.includes(post.id);
        const searchMatch =
          !query ||
          [post.title, post.creator, post.description, post.category]
            .join(' ')
            .toLowerCase()
            .includes(query.toLowerCase());
        return categoryMatch && navMatch && searchMatch;
      }),
    [posts, activeCategory, activeNav, saved, query]
  );

  const publishPost = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setNotice('Please add a title before publishing.');
      return;
    }
    if (!videoUrl.trim() || !/^https?:\/\//i.test(videoUrl.trim())) {
      setNotice(
        'Add a valid public video URL starting with https:// or http://.'
      );
      return;
    }
    const draft = {
      title: trimmedTitle,
      creator: creator.trim() || 'Community creator',
      category,
      description: description.trim(),
      source:
        source.trim() ||
        'Source not supplied — verify religious references before sharing.',
      videoUrl: videoUrl.trim(),
      color: 'emerald',
    };
    try {
      const { data } = await api.post('/api/posts', draft);
      const post = data.post as Post;
      setPosts(current => [post, ...current]);
      setActiveCategory('All');
      setActiveNav('For you');
      setShowCreate(false);
      setTitle('');
      setCreator('');
      setDescription('');
      setSource('');
      setVideoUrl('');
      setNotice('Your post is now in the Deentok feed.');
    } catch {
      setNotice(
        'We could not publish right now. Please try again in a moment.'
      );
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Deentok home">
          <span className="brand-mark">د</span>
          <span>
            deen<span className="brand-accent">tok</span>
            <small>Faith in every scroll</small>
          </span>
        </a>
        <div className="search-wrap">
          <Search size={18} />
          <input
            aria-label="Search Deentok"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recitations, reminders, stories..."
          />
          <kbd>⌘ K</kbd>
        </div>
        <div className="top-actions">
          <button
            className="create-btn"
            onClick={() => {
              setShowCreate(true);
              setNotice('');
            }}
          >
            <CirclePlus size={18} /> Create
          </button>
          <div className="avatar">D</div>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <p className="eyebrow">YOUR SPACE</p>
          {(
            [
              { label: 'For you', icon: Home },
              { label: 'Explore', icon: Compass },
              { label: 'Saved', icon: Bookmark },
            ] as const
          ).map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={'nav-item ' + (activeNav === label ? 'active' : '')}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={19} />
              {label}
              {label === 'Saved' && saved.length > 0 && (
                <span className="nav-count">{saved.length}</span>
              )}
            </button>
          ))}
          <div className="side-rule" />
          <p className="eyebrow">EXPLORE DEEN</p>
          {categories.slice(1).map(item => {
            const Icon = categoryIcon[item];
            return (
              <button
                key={item}
                className={
                  'nav-item category-nav ' +
                  (activeCategory === item ? 'active' : '')
                }
                onClick={() => {
                  setActiveCategory(item);
                  setActiveNav('Explore');
                }}
              >
                <Icon size={18} />
                {item}
              </button>
            );
          })}
          <div className="side-note">
            <span className="note-icon">
              <ShieldCheck size={19} />
            </span>
            <strong>A space for beneficial content</strong>
            <p>
              Share with care. Verify religious references and respect
              copyright.
            </p>
          </div>
          <div className="sidebar-footer">
            © 2026 Deentok
            <br />
            Made for beneficial reminders.
          </div>
        </aside>
        <main className="main-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                ASSALAMU ALAIKUM <span>✦</span>
              </p>
              <h1>
                Let your scroll bring you <em>closer.</em>
              </h1>
              <p className="subhead">
                A home for recitation, remembrance, stories, and learning.
              </p>
            </div>
            <div className="welcome-badge">
              <span>بِسْمِ اللَّهِ</span>
              <small>Begin with intention</small>
            </div>
          </div>
          <div className="category-strip">
            {categories.map(item => {
              const Icon = categoryIcon[item];
              return (
                <button
                  key={item}
                  className={
                    'category-chip ' +
                    (activeCategory === item ? 'selected' : '')
                  }
                  onClick={() => {
                    setActiveCategory(item);
                    if (item !== 'All') setActiveNav('Explore');
                  }}
                >
                  <Icon size={15} />
                  {item}
                </button>
              );
            })}
          </div>
          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice('')}
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="section-heading">
            <div>
              <h2>
                {activeNav === 'Saved'
                  ? 'Your saved reminders'
                  : activeNav === 'Explore'
                    ? 'Explore beneficial content'
                    : 'A little goodness for your day'}
              </h2>
              <p>
                {visiblePosts.length}{' '}
                {visiblePosts.length === 1 ? 'post' : 'posts'} to explore
              </p>
            </div>
            <button
              className="sort-btn"
              onClick={() => {
                setActiveCategory('All');
                setActiveNav('For you');
                setQuery('');
              }}
            >
              Reset filters <ChevronDown size={15} />
            </button>
          </div>
          {visiblePosts.length === 0 ? (
            <div className="empty-state">
              <Bookmark size={28} />
              <h3>Nothing here just yet</h3>
              <p>Try another category or save a post to find it here later.</p>
            </div>
          ) : (
            <div className="feed-grid">
              {visiblePosts.map(post => {
                const isLiked = liked.includes(post.id);
                const isSaved = saved.includes(post.id);
                return (
                  <article className="post-card" key={post.id}>
                    <div className={'post-media media-' + post.color}>
                      {post.videoUrl ? (
                        <video
                          src={post.videoUrl}
                          controls
                          playsInline
                          muted={muted}
                          onPlay={() => setPlaying(post.id)}
                          onError={() =>
                            setNotice(
                              'This video source could not be played. Check that the URL is public and allows embedding.'
                            )
                          }
                        />
                      ) : (
                        <div className="artwork">
                          <span className="artwork-kicker">
                            {post.category.toUpperCase()} • DEENTOK
                          </span>
                          <div className="ornament">✦</div>
                          <h3>
                            {post.category === 'Quran'
                              ? 'Listen. Reflect. Return.'
                              : post.category === 'Hadith'
                                ? 'Knowledge with intention'
                                : post.category === 'Seerah'
                                  ? 'Lives that inspire'
                                  : post.category === 'Nasheed'
                                    ? 'A heart in remembrance'
                                    : post.category === 'Prophets'
                                      ? 'Lessons through the ages'
                                      : 'Grow in goodness'}
                          </h3>
                          <p>{post.title}</p>
                          <span className="artwork-footer">
                            A BENEFICIAL MOMENT
                          </span>
                        </div>
                      )}
                      {!post.videoUrl && (
                        <button
                          className="play-overlay"
                          aria-label={'Explore ' + post.title}
                          onClick={() => setNotice(post.source)}
                        >
                          <Play size={21} fill="currentColor" />
                        </button>
                      )}
                      <span className="media-tag">
                        {post.duration || 'Reminder'}
                      </span>
                      <button
                        className="mute-btn"
                        aria-label={muted ? 'Unmute videos' : 'Mute videos'}
                        onClick={() => setMuted(!muted)}
                      >
                        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                    <div className="post-body">
                      <div className="creator-row">
                        <div className="creator-avatar">
                          {post.creator.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="creator-info">
                          <strong>{post.creator}</strong>
                          <span>
                            {post.category} ·{' '}
                            {post.duration || 'Beneficial content'}
                          </span>
                        </div>
                        <button
                          className="follow-btn"
                          onClick={() =>
                            setNotice(
                              'Creator follows will be available with accounts in a future update.'
                            )
                          }
                        >
                          Follow
                        </button>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-description">{post.description}</p>
                      <div className="source-line">
                        <ShieldCheck size={14} />
                        <span>{post.source}</span>
                      </div>
                      <div className="post-actions">
                        <button
                          className={
                            isLiked ? 'engagement active-like' : 'engagement'
                          }
                          onClick={() =>
                            setLiked(current =>
                              isLiked
                                ? current.filter(id => id !== post.id)
                                : [...current, post.id]
                            )
                          }
                        >
                          <Heart
                            size={17}
                            fill={isLiked ? 'currentColor' : 'none'}
                          />
                          {(post.likes || 0) + (isLiked ? 1 : 0)}
                        </button>
                        <button
                          className={
                            isSaved ? 'engagement saved' : 'engagement'
                          }
                          onClick={() =>
                            setSaved(current =>
                              isSaved
                                ? current.filter(id => id !== post.id)
                                : [...current, post.id]
                            )
                          }
                        >
                          <Bookmark
                            size={16}
                            fill={isSaved ? 'currentColor' : 'none'}
                          />
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                        <button
                          className="share-btn"
                          onClick={() => {
                            if (navigator.share)
                              navigator
                                .share({
                                  title: post.title,
                                  text: post.description,
                                })
                                .catch(() => {});
                            else
                              setNotice(
                                'Copy the post title to share: ' + post.title
                              );
                          }}
                          aria-label="Share post"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <div className="community-banner">
            <div className="banner-symbol">☾</div>
            <div>
              <strong>Share something beneficial.</strong>
              <p>Have a recitation, lesson, or reminder to contribute?</p>
            </div>
            <button onClick={() => setShowCreate(true)}>
              Create a post <CirclePlus size={16} />
            </button>
          </div>
          <footer className="main-footer">
            <span>Deentok · Faith in every scroll</span>
            <span>Verify sources · Honour creators · Share with adab</span>
          </footer>
        </main>
      </div>
      {showCreate && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={e => {
            if (e.target === e.currentTarget) setShowCreate(false);
          }}
        >
          <section
            className="create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">COMMUNITY CONTRIBUTION</p>
                <h2 id="create-title">Create a Deentok post</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowCreate(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <p className="modal-intro">
              Share beneficial Islamic content with a clear source. Only share
              videos you have permission to use.
            </p>
            <label>
              Post title
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your post a clear title"
              />
            </label>
            <label>
              Creator / channel
              <input
                value={creator}
                onChange={e => setCreator(e.target.value)}
                placeholder="Who created this content?"
              />
            </label>
            <label>
              Content category
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
              >
                {categories.slice(1).map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Public video URL
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
              />
            </label>
            <label>
              Caption
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What should viewers learn or reflect on?"
                rows={3}
              />
            </label>
            <label>
              Reference / source note
              <input
                value={source}
                onChange={e => setSource(e.target.value)}
                placeholder="Surah, hadith collection, speaker, or license"
              />
            </label>
            <div className="form-hint">
              <ShieldCheck size={16} /> Please verify quotations and permissions
              before publishing.
            </div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button className="publish-btn" onClick={publishPost}>
                <Check size={17} /> Publish post
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
