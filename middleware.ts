export const config = {
  // Only run the middleware on the home route
  matcher: '/',
}

export default function middleware(request) {
  // Store the country where we will be redirecting
  let country = request.headers.get('x-vercel-ip-country') || ''

  country = country.toLowerCase()

  // Return a new redirect response
  return new Response(null, { headers: { country: country } })
}
