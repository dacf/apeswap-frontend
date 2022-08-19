export const config = {
  matcher: '/',
}

export default function middleware(request) {
  // Construct the url
  const url = new URL(request.url)

  // Store the country where we will be redirecting
  let country = request.headers.get('x-vercel-ip-country') || ''

  country = country.toLowerCase()
  if (country !== 'es') {
    country = 'us'
  }

  // Update url pathname
  url.searchParams.set('country', country)
  console.log(url)
  console.log(country)
  console.log(request)
}
