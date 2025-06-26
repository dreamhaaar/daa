// js/auth_checker.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  'https://nyvnrrqqeiqtujgmsbns.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dm5ycnFxZWlxdHVqZ21zYm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjIzNzUsImV4cCI6MjA2NjQ5ODM3NX0.gnx7Me9ICxXru7jR4QYNGNGI4Tji3vTZd7cTWBuVRSA'
)

document.addEventListener('DOMContentLoaded', async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    // optional: clear sessionStorage
    sessionStorage.clear()
    window.location.href = 'login.html' // or login.html
  }
})
