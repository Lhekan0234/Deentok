import { router, json, error, db } from '@appdeploy/sdk';

type DeentokPost = {
  title: string;
  creator: string;
  category: string;
  description: string;
  source: string;
  videoUrl: string;
  color: string;
  createdAt: string;
};

export const handler = router({
  'GET /api/_healthcheck': [
    async () => json({ message: 'Deentok API is ready' }),
  ],
  'GET /api/posts': [
    async () => {
      const result = await db.list<DeentokPost>('deentok_posts', { limit: 60 });
      return json({ posts: result.items });
    },
  ],
  'POST /api/posts': [
    async ({ body }) => {
      const input = body as Partial<DeentokPost>;
      if (!input || typeof input.title !== 'string' || !input.title.trim()) {
        return error('A post title is required.', 400);
      }
      if (
        typeof input.videoUrl !== 'string' ||
        !/^https?:\/\//i.test(input.videoUrl)
      ) {
        return error('A valid public video URL is required.', 400);
      }
      const allowed = [
        'Quran',
        'Hadith',
        'Nasheed',
        'Seerah',
        'Prophets',
        'Learning',
      ];
      if (!input.category || !allowed.includes(input.category)) {
        return error('Choose a valid Islamic content category.', 400);
      }
      const record: DeentokPost = {
        title: input.title.trim().slice(0, 140),
        creator:
          typeof input.creator === 'string'
            ? input.creator.trim().slice(0, 80) || 'Community creator'
            : 'Community creator',
        category: input.category,
        description:
          typeof input.description === 'string'
            ? input.description.trim().slice(0, 1200)
            : '',
        source:
          typeof input.source === 'string'
            ? input.source.trim().slice(0, 500) ||
              'Source not supplied — verify religious references before sharing.'
            : 'Source not supplied — verify religious references before sharing.',
        videoUrl: input.videoUrl.trim(),
        color: 'emerald',
        createdAt: new Date().toISOString(),
      };
      const [id] = await db.add('deentok_posts', [
        record as unknown as Record<string, unknown>,
      ]);
      if (!id)
        return error('The post could not be saved. Please try again.', 500);
      return json(
        { post: { ...record, id, likes: 0, duration: 'Community post' } },
        201
      );
    },
  ],
});
