import { createFileRoute } from '@tanstack/react-router'
import { syncPublicContent } from '@/lib/sync-content.functions'

export const Route = createFileRoute('/api/public/sync-trigger')({
  server: {
    handlers: {
      GET: async () => {
        try {
          // syncPublicContent is a server function, it can be called directly on server
          await syncPublicContent();
          return new Response(JSON.stringify({ success: true, message: 'Sync completed' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      },
      POST: async () => {
        try {
          await syncPublicContent();
          return new Response(JSON.stringify({ success: true, message: 'Sync completed' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }
})
