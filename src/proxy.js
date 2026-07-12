import { NextResponse } from 'next/server'
import { getSession } from './actions/session'
 
// This function can be marked `async` if using `await` inside
export async function proxy(request) {
    const user = await getSession();
    if(!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
  
}
 
export const config = {
  matcher: ['/pricing', '/dashboard', '/updates', '/public', '/profile', '/api']
}