export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''
  const categories = searchParams.get('categories') || '111'
  const purity = searchParams.get('purity') || '100'
  const sorting = searchParams.get('sorting') || 'relevance'
  const page = searchParams.get('page') || '1'
  const atleast = searchParams.get('atleast') || ''
  const resolutions = searchParams.get('resolutions') || ''
  const ratios = searchParams.get('ratios') || ''
  const topRange = searchParams.get('topRange') || ''
  const colors = searchParams.get('colors') || ''
  const order = searchParams.get('order') || ''
  const seed = searchParams.get('seed') || ''

  const apiKey = process.env.WALLHAVEN_API_KEY || ''

  let url = `https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}&categories=${categories}&purity=${purity}&sorting=${sorting}&page=${page}`
  if (apiKey) url += `&apikey=${apiKey}`
  if (atleast) url += `&atleast=${atleast}`
  if (resolutions) url += `&resolutions=${resolutions}`
  if (ratios) url += `&ratios=${ratios}`
  if (topRange) url += `&topRange=${topRange}`
  if (colors) url += `&colors=${colors}`
  if (order) url += `&order=${order}`
  if (seed) url += `&seed=${seed}`

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
