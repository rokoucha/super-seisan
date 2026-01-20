export async function GET(request: Request) {
  return new Response('', {
    status: 302,
    headers: {
      Location: 'https://super-seisan.pages.dev',
    },
  })
}
