// Without a defined matcher, this one line applies next-auth to the entire project.


export { default } from 'next-auth/middleware' // This is the only line needed to apply next-auth to the entire project.

// Applies next-auth only to matches routes, this can be regex
// Currently there are no pages that shouldn't be protected by next-auth so we match all pages.
// Here is the Next.Js documentation. https://nextjs.org/docs/app/building-your-application/routing/middleware

// export const config = { matcher: ['/:path*']}
export const config = { matcher: ['/dashboard/overview']}
