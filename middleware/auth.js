export default function(context) {
  console.log('[Middleware] Authenticated') 
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth')
  }
}