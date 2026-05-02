import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gptvcaqbedjlugetlglj.supabase.co'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // 需要从Supabase Dashboard获取

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
