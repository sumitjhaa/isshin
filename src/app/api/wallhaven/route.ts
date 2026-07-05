export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const categories = searchParams.get('categories') || '111'
  const purity = searchParams.get('purity') || '100'
  const sorting = searchParams.get('sorting') || 'relevance'
  const page = searchParams.get('page') || '1'

  const url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}&categories=${categories}&purity=${purity}&sorting=${sorting}&page=${page}`

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    })
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Failed to fetch wallpapers' }, { status: 500 })
  }
}
