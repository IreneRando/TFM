import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cwewxjwymectnbcriqab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZXd4and5bWVjdG5iY3JpcWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjgyNjQsImV4cCI6MjA2NTI0NDI2NH0.QU3b2M3LENMaMzmd1gCiHnq76Xovj08Dsfgyu4hCXH8'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;