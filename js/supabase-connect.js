import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
export { supabase }

const supabase = createClient(
    'https://ppecvcuzlisqhbpwvsqh.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZWN2Y3V6bGlzcWhicHd2c3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTM1OTEsImV4cCI6MjA3NzU2OTU5MX0.hi_MR7IdOhmV-JvUqXNIU3c7Fz-IFutjJcVvD7pIQfk',  
  )

async function supaSignIn() {
    const { error } = await supabase.auth.signIn({
        email: 'railcar_implicit184@cldmss.com'
    })
}
