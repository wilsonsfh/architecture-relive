export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    const json = (data, status = 200) => Response.json(data, { status });
    if (url.pathname === '/api/status') return json({ model_enabled: false, models: [] });
    if (url.pathname === '/api/ping') return json({ ok: true, model_enabled: false });
    const source = await env.ASSETS.fetch(new Request(new URL('/hosted-records.json', url)));
    if (!source.ok) return json({ error: 'Building catalog unavailable' }, 503);
    const { records, photos } = await source.json();
    const id = url.searchParams.get('id');
    if (url.pathname === '/api/b') {
      const building = records.find(record => record.id === id);
      return building ? json(building) : json({ error: 'Unknown building' }, 404);
    }
    if (url.pathname === '/api/scene-photos') return json({ photos: photos[id] || [] });
    if (url.pathname === '/api/resolve') {
      const query = (url.searchParams.get('q') || '').trim().toLocaleLowerCase();
      const building = query.length >= 3 && records.find(record => [record.id, record.name, record.wikidata?.label].filter(Boolean).some(value => value.toLocaleLowerCase().includes(query)));
      return building ? json({ building }) : json({ refusal: 'This hosted prototype uses its saved building catalog. Try one of the featured buildings; live lookup and AI generation require the local app.' });
    }
    return json({ error: 'Not found' }, 404);
  }
};
