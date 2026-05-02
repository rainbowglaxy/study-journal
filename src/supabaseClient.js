import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gptvcaqbedjlugetlglj.supabase.co'
const supabaseAnonKey = 'sb_publishable_GaqvBqUB9mwCU-yrGElArQ_PRuXKEGy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
