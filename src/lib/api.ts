type DeentokPost = {
  id: string; title: string; creator: string; category: string;
  description: string; source: string; videoUrl?: string; likes?: number;
  duration?: string; color: string;
};

const STORAGE_KEY = 'deentok-community-posts';
function readPosts(): DeentokPost[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as DeentokPost[]) : [];
  } catch { return []; }
}
function writePosts(posts: DeentokPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
export const api = {
  async get(path: string) {
    if (path !== '/api/posts') throw new Error('Unknown API route');
    return { data: { posts: readPosts() } };
  },
  async post(path: string, body: Omit<DeentokPost, 'id' | 'likes' | 'duration'>) {
    if (path !== '/api/posts') throw new Error('Unknown API route');
    const post: DeentokPost = { ...body, id: `community-${Date.now()}`, likes: 0, duration: 'Community post' };
    writePosts([post, ...readPosts()]);
    return { data: { post } };
  },
};
