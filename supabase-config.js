/*
  CẤU HÌNH SUPABASE — đã điền sẵn thông tin project "MAT TONG VIET"
  Updated: 2026-08-13 - Using fresh anon key from Dashboard
*/
const SUPABASE_URL = 'https://lnhrzszaxwihjccskjkx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaHJ6c3pheHdpaGpjY3Nramt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1OTk3MTIsImV4cCI6MjEwMjE3NTcxMn0.Sib4r4E7k8eeTSQPdL-Do8B2ayn68t5_jV1wtiFTxCs';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);