export const config = {
  // Only run the middleware on the home route
  matcher: '*',
}

export default function middleware(request) {
  // Construct the url
  const url = new URL(request.url)

  // Store the country where we will be redirecting
  let country = request.headers.get('x-vercel-ip-country') || ''

  country = country.toLowerCase()
  if (country === 'us' || country === 'mx') {
    url.pathname = `/${country}.html`
  }

  // Update url pathname
  url.pathname = `/${country}.html`

  // Return a new redirect response

  return Response.redirect(url)
}
