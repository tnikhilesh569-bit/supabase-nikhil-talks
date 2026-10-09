import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Post, MarketplaceItem, NoticeSettings, AdminAuditLog } from '../types';
export const INITIAL_SETTINGS: NoticeSettings = {
  marqueeText: "Sabse pehle latest updates pane ke liye humare official WhatsApp Channel se judein! Daily government jobs, results aur schemes alerts.",
  marqueeEnabled: true,
  emergencyAlert: "ALERT: BSSC Inter Level & SSC CGL Online Form Dates Active - Check Vacancy Details & Apply Before Deadline!",
  mainWaUrl: "https://whatsapp.com/channel/0029VaXXXXXXXXXX",
  ch1: "https://whatsapp.com/channel/nikhil-talks-jobs",
  ch2: "https://whatsapp.com/channel/nikhil-talks-notices",
  ch3: "https://whatsapp.com/channel/nikhil-talks-scholarships",
  ch4: "https://whatsapp.com/channel/nikhil-talks-yojna",
  aboutText: "Nikhil Talks is your trusted student & career portal providing official job notices, entrance updates, sarkari yojna details, and utility marketplace services.",
  supportEmail: "support@nikhiltalks.com",
  supportPhone: "+91 98765 43210",
  monetagEnabled: true,
  monetagZoneCode: "11853011",
  monetagInPagePush: true
};

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-bssc-2026",
    title: "Bihar SSC Inter Level Recruitment 2026 Online Form Reopened",
    category: "Jobs",
    tags: ["bssc", "bihar jobs", "inter level", "10+2", "sarkari result"],
    summary: "Bihar Staff Selection Commission (BSSC) has released 12,199+ vacancies for LDC, Panchayat Secretary, and Revenue Staff. Check eligibility, age limit, and apply online before last date.",
    body: `<h3>Bihar SSC 2nd Inter Level Combined Competitive Exam 2026</h3>
<p>Bihar Staff Selection Commission (BSSC) has announced direct recruitment for 12,199+ various posts across Bihar Government departments. Candidates who have passed 10+2 (Intermediate) examination are eligible to apply.</p>
<h4>Selection Process:</h4>
<ul>
  <li>Preliminary Written Examination (Objective Type - 150 Questions)</li>
  <li>Mains Written Examination</li>
  <li>Typing / Computer Proficiency Test (where applicable)</li>
  <li>Document Verification & Final Merit List</li>
</ul>
<h4>Age Limit (as on 01/08/2025):</h4>
<p>Minimum Age: 18 Years. Maximum Age: 37 Years (Male General), 40 Years (BC/EBC & Female General), 42 Years (SC/ST).</p>`,
    quickInfo: [
      { key: "Application Start Date", val: "15 January 2026" },
      { key: "Last Date to Apply", val: "31 March 2026" },
      { key: "Application Fee", val: "General / OBC / EWS: ₹540 | SC / ST / PwD / Female: ₹135" },
      { key: "Minimum Qualification", val: "10+2 (Intermediate) from any recognized board" },
      { key: "Total Vacancies", val: "12,199 Posts" },
      { key: "Pay Scale", val: "Level-2 & Level-4 (₹19,900 - ₹63,200)" }
    ],
    importantLinks: [
      { label: "Apply Online (Registration)", url: "https://onlinebssc.com/", status: "active" },
      { label: "Official Notification PDF", url: "https://bssc.bihar.gov.in/", status: "active" },
      { label: "Admit Card Download", url: "#", status: "soon" },
      { label: "Official Website", url: "https://bssc.bihar.gov.in/", status: "active" }
    ],
    views: 1842,
    isPinned: true,
    isDraft: false,
    lastDate: "2026-03-31",
    qualification: "10+2 (Inter)",
    salaryInfo: "₹19,900 - ₹63,200/mo",
    totalVacancies: "12,199 Posts",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "post-ssc-cgl-2026",
    title: "SSC CGL 2026 Notification, Vacancies & Exam Calendar Announced",
    category: "Jobs",
    tags: ["ssc", "cgl", "inspector", "central jobs"],
    summary: "Staff Selection Commission (SSC) has announced Combined Graduate Level (CGL) examination schedule for Inspector, Auditor, and Assistant Section Officer posts.",
    body: `<h3>SSC CGL Examination 2026 Important Notice</h3>
<p>Staff Selection Commission conducts the Combined Graduate Level (CGL) Examination for recruitment to Group 'B' and Group 'C' posts in various Ministries/Departments/Organizations of Government of India.</p>
<h4>Educational Qualification:</h4>
<p>Bachelor's Degree in any discipline from a recognized University or equivalent.</p>`,
    quickInfo: [
      { key: "Notification Release", val: "10 February 2026" },
      { key: "Last Date to Apply", val: "15 April 2026" },
      { key: "Tier-1 Exam Date", val: "June - July 2026" },
      { key: "Application Fee", val: "₹100 (Women/SC/ST: Nil)" },
      { key: "Selection Mode", val: "Tier-1 (CBE) + Tier-2 (CBE)" }
    ],
    importantLinks: [
      { label: "Official SSC Portal", url: "https://ssc.gov.in/", status: "active" },
      { label: "Exam Calendar PDF", url: "https://ssc.gov.in/", status: "active" }
    ],
    views: 1240,
    isPinned: true,
    isDraft: false,
    lastDate: "2026-04-15",
    qualification: "Bachelor's Degree",
    salaryInfo: "₹44,900 - ₹1,42,400/mo",
    totalVacancies: "8,400+ Posts",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "post-cbse-notices-2026",
    title: "CBSE Board 10th & 12th Admit Card and Center List Released",
    category: "Notices",
    tags: ["cbse", "admit card", "board exams", "roll number"],
    summary: "Central Board of Secondary Education has released regular and private candidate roll number slips. Download schools center allotment list.",
    body: `<h3>CBSE Board Exam 2026 Guidelines</h3>
<p>Students appearing for CBSE Class 10 and 12 Board examinations can collect their original stamped admit cards from their respective school principals. Private students can download their admit card using registration credentials.</p>`,
    quickInfo: [
      { key: "Board", val: "CBSE New Delhi" },
      { key: "Classes", val: "Class 10th & 12th" },
      { key: "Exam Mode", val: "Pen & Paper (Offline)" }
    ],
    importantLinks: [
      { label: "Download Private Candidate Admit Card", url: "https://cbse.gov.in/", status: "active" },
      { label: "Official Circular", url: "https://cbse.gov.in/", status: "active" }
    ],
    views: 654,
    isDraft: false,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "post-scholarship-nsp-2026",
    title: "National Scholarship Portal (NSP 2025-26) Biometric KYC & Renewal",
    category: "Scholarships",
    tags: ["scholarship", "nsp", "minority", "post matric", "pre matric"],
    summary: "Ministry of Minority Affairs & Social Justice has opened portal for NSP Aadhaar Biometric authentication and disbursement of funds for eligible students.",
    body: `<h3>National Scholarship Scheme 2025-26 Registration</h3>
<p>All students applying for Central Sector Scholarship Schemes under NSP are advised to complete their Biometric Facial / Fingerprint Authentication at Common Service Centres (CSC) or respective colleges before deadline.</p>`,
    quickInfo: [
      { key: "Scheme Name", val: "Central Sector & Post Matric Scholarships" },
      { key: "Disbursement", val: "Direct Benefit Transfer (DBT) into Bank" },
      { key: "Required Documents", val: "Aadhaar, Income Certificate, Fee Receipt, Marksheet" }
    ],
    importantLinks: [
      { label: "NSP Login / Renewal", url: "https://scholarships.gov.in/", status: "active" },
      { label: "Check DBT Payment Status (PFMS)", url: "https://pfms.nic.in/", status: "active" }
    ],
    views: 1120,
    isDraft: false,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "post-pm-kisan-yojna-2026",
    title: "PM Kisan Samman Nidhi 19th Installment Date & e-KYC Update",
    category: "Sarkari Yojna",
    tags: ["pm kisan", "19th installment", "yojna", "dbt", "kisan portal"],
    summary: "Prime Minister Kisan Samman Nidhi 19th installment ₹2,000 transfer scheduled. Check beneficiary list and OTP based eKYC process.",
    body: `<h3>Pradhan Mantri Kisan Samman Nidhi 19th Kist</h3>
<p>Under the PM-KISAN scheme, eligible landholding farmer families receive financial assistance of ₹6,000 per annum distributed in three equal quarterly installments of ₹2,000 each.</p>`,
    quickInfo: [
      { key: "Installment Amount", val: "₹2,000 directly via DBT" },
      { key: "Mandatory Requirement", val: "e-KYC & Aadhaar Seeding with Bank" },
      { key: "Toll Free Helpline", val: "155261 / 011-24300606" }
    ],
    importantLinks: [
      { label: "Check Beneficiary Status", url: "https://pmkisan.gov.in/", status: "active" },
      { label: "Complete OTP e-KYC", url: "https://pmkisan.gov.in/", status: "active" }
    ],
    views: 2040,
    isDraft: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: "market-1",
    title: "NCERT Class 11 & 12 Physics, Chemistry, Maths (Clean Condition)",
    category: "books",
    price: 350,
    location: "Kankarbagh, Patna",
    whatsapp: "919876543210",
    desc: "Complete PCB/PCM NCERT set without any markings. Perfect for NEET / JEE prep. Passing out student selling urgently.",
    status: "approved",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "market-2",
    title: "Redmi 9 Power 64GB - Best for Online Classes & Mock Tests",
    category: "gadgets",
    price: 2400,
    location: "Boring Road, Patna",
    whatsapp: "919876543211",
    desc: "6000mAh battery with bill and box. Battery backup lasts 2 full days. Used only for studying and Testbook mocks.",
    status: "approved",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "market-3",
    title: "Single Room for Student with Study Table & RO Water",
    category: "rooms",
    price: 3200,
    location: "Musallahpur Hat, Patna",
    whatsapp: "919876543212",
    desc: "Quiet study atmosphere near library and coaching hub. 24x7 water and electricity. No broker fee.",
    status: "approved",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "market-4",
    title: "Online Form Filling & Photo/Signature Resizing Support",
    category: "services",
    price: 40,
    location: "Online (WhatsApp / Remote)",
    whatsapp: "919876543213",
    desc: "Having trouble resizing photos for BSSC, SSC, or Railway? Fast 10-minute online form assistance with instant confirmation slip.",
    status: "approved",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "market-5",
    title: "Drishti IAS Hindi Sahitya Notes (Pen Drive + Printed)",
    category: "books",
    price: 600,
    location: "Ranchi / Courier",
    whatsapp: "919876543214",
    desc: "Complete Vikas Divyakirti Sir class notes and model answer copies. Very clean handwritten notes.",
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

const STORAGE_POSTS_KEY = 'nikhil_talks_posts';
const STORAGE_MARKET_KEY = 'nikhil_talks_market';
const STORAGE_SETTINGS_KEY = 'nikhil_talks_settings';
const STORAGE_AUDIT_KEY = 'nikhil_talks_audit_logs';
const STORAGE_ADMIN_SESSION_KEY = 'nikhil_talks_admin_session';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

function localGet<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); if (value) return JSON.parse(value) as T; localStorage.setItem(key, JSON.stringify(fallback)); } catch {}
  return fallback;
}
function localSet<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
export const getLocalPosts = () => localGet<Post[]>(STORAGE_POSTS_KEY, INITIAL_POSTS);
export const setLocalPosts = (value: Post[]) => localSet(STORAGE_POSTS_KEY, value);
export const getLocalMarket = () => localGet<MarketplaceItem[]>(STORAGE_MARKET_KEY, INITIAL_MARKETPLACE);
export const setLocalMarket = (value: MarketplaceItem[]) => localSet(STORAGE_MARKET_KEY, value);
export const getLocalSettings = () => localGet<NoticeSettings>(STORAGE_SETTINGS_KEY, INITIAL_SETTINGS);
export const setLocalSettings = (value: NoticeSettings) => localSet(STORAGE_SETTINGS_KEY, value);
export const getAuditLogs = () => localGet<AdminAuditLog[]>(STORAGE_AUDIT_KEY, []);
export function addAuditLog(action: string, target: string, user = 'Admin', details?: string) {
  const logs = getAuditLogs(); logs.unshift({ id: `log-${Date.now()}`, action, target, timestamp: new Date().toISOString(), user, details }); localSet(STORAGE_AUDIT_KEY, logs.slice(0, 100));
}
export function clearAuditLogs() { localSet(STORAGE_AUDIT_KEY, []); }
function ensureSupabase() { if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'); return supabase; }
function rowToPost(row: any): Post { return { ...row.data, id: row.id, title: row.title ?? row.data?.title ?? 'Untitled Post', category: row.category ?? row.data?.category ?? 'Jobs', views: row.views ?? row.data?.views ?? 0, createdAt: row.created_at ?? row.data?.createdAt ?? new Date().toISOString(), updatedAt: row.updated_at ?? row.data?.updatedAt, isDraft: row.is_draft ?? row.data?.isDraft ?? false, isPinned: row.is_pinned ?? row.data?.isPinned ?? false }; }
function postRow(p: Partial<Post>) { return { title: p.title, category: p.category, views: p.views ?? 0, is_draft: !!p.isDraft, is_pinned: !!p.isPinned, created_at: p.createdAt ?? new Date().toISOString(), updated_at: new Date().toISOString(), data: { ...p } }; }
export async function fetchAllPosts(): Promise<Post[]> {
  try { const { data, error } = await ensureSupabase().from('posts').select('*').order('created_at', { ascending: false }); if (error) throw error; const posts = (data ?? []).map(rowToPost); setLocalPosts(posts); return posts; }
  catch (e) { console.warn('Supabase posts unavailable; showing cached content.', e); return getLocalPosts(); }
}
export async function fetchPostById(id: string): Promise<Post | null> { const posts = await fetchAllPosts(); return posts.find(p => p.id === id) ?? getLocalPosts().find(p => p.id === id) ?? null; }
export async function savePostToDb(p: Omit<Post, 'id'|'views'|'createdAt'> & { id?: string; views?: number }): Promise<string> {
  const client = ensureSupabase();
  const now = new Date().toISOString();
  const cached = p.id ? getLocalPosts().find((item) => item.id === p.id) : undefined;
  const createdAt = cached?.createdAt ?? now;
  const payload = postRow({ ...p, createdAt });
  let result: { data: { id: string } | null; error: any };
  if (p.id) {
    // Update existing remote records; if a default/demo record has not been imported yet,
    // create it with its original text ID rather than failing an UPDATE with zero rows.
    const updated = await client.from('posts').update(payload).eq('id', p.id).select('id').maybeSingle();
    if (updated.error) throw updated.error;
    if (updated.data) result = { data: updated.data, error: null };
    else result = await client.from('posts').insert({ ...payload, id: p.id }).select('id').single();
  } else {
    result = await client.from('posts').insert(payload).select('id').single();
  }
  if (result.error) throw result.error;
  const id = result.data!.id as string;
  const post = { ...p, id, views: p.views ?? 0, createdAt } as Post;
  const posts = getLocalPosts();
  const index = posts.findIndex((item) => item.id === id);
  if (index >= 0) posts[index] = post; else posts.unshift(post);
  setLocalPosts(posts);
  addAuditLog(p.id ? 'Post Updated' : 'Post Created', p.title);
  return id;
}
export async function deletePostFromDb(id: string) { const { error } = await ensureSupabase().from('posts').delete().eq('id', id); if(error) throw error; setLocalPosts(getLocalPosts().filter(p=>p.id!==id)); addAuditLog('Post Deleted', id); }
export async function bulkDeletePostsFromDb(ids: string[]) { if(!ids.length)return; const {error}=await ensureSupabase().from('posts').delete().in('id',ids); if(error)throw error; setLocalPosts(getLocalPosts().filter(p=>!ids.includes(p.id))); }
export async function bulkUpdatePostsPin(ids: string[], isPinned: boolean) { for(const id of ids){ const p=getLocalPosts().find(x=>x.id===id); if(p) await savePostToDb({...p,isPinned}); } }
export async function fetchMarketplace(): Promise<MarketplaceItem[]> { try { const {data,error}=await ensureSupabase().from('marketplace').select('*').order('created_at',{ascending:false}); if(error)throw error; const items=(data??[]).map((r:any)=>({...r.data,id:r.id,status:r.status,createdAt:r.created_at} as MarketplaceItem)); setLocalMarket(items); return items; } catch(e){console.warn('Supabase marketplace unavailable; showing cache.',e); return getLocalMarket();} }
export async function submitMarketListing(data: Omit<MarketplaceItem,'id'|'status'|'createdAt'>): Promise<string> { const now=new Date().toISOString(); const {data:row,error}=await ensureSupabase().from('marketplace').insert({status:'pending',created_at:now,data}).select('id').single(); if(error)throw error; const item={...data,id:row.id,status:'pending' as const,createdAt:now}; setLocalMarket([item,...getLocalMarket()]); return row.id; }
export async function updateMarketListingStatus(id:string,status:'approved'|'rejected'|'sold') { const {error}=await ensureSupabase().from('marketplace').update({status}).eq('id',id); if(error)throw error; setLocalMarket(getLocalMarket().map(x=>x.id===id?{...x,status}:x)); }
export async function updateMarketListingDetails(id:string,details:Partial<MarketplaceItem>) { const current=getLocalMarket().find(x=>x.id===id); if(!current)throw new Error('Listing not found'); const {error}=await ensureSupabase().from('marketplace').update({data:{...current,...details}}).eq('id',id); if(error)throw error; setLocalMarket(getLocalMarket().map(x=>x.id===id?{...x,...details}:x)); }
export async function deleteMarketListing(id:string) { const {error}=await ensureSupabase().from('marketplace').delete().eq('id',id); if(error)throw error; setLocalMarket(getLocalMarket().filter(x=>x.id!==id)); }
export async function fetchNoticeSettings():Promise<NoticeSettings> { try { const {data,error}=await ensureSupabase().from('site_settings').select('value').eq('id','noticeBar').maybeSingle(); if(error)throw error; const value={...INITIAL_SETTINGS,...(data?.value??{})}; setLocalSettings(value); return value; } catch(e){console.warn('Supabase settings unavailable; showing cache.',e); return getLocalSettings();} }
export async function saveNoticeSettings(settings:Partial<NoticeSettings>) { const value={...getLocalSettings(),...settings}; const {error}=await ensureSupabase().from('site_settings').upsert({id:'noticeBar',value,updated_at:new Date().toISOString()}); if(error)throw error; setLocalSettings(value); addAuditLog('Settings Updated','Site Settings'); }
export function resetAllDataToDefault() { setLocalPosts(INITIAL_POSTS); setLocalMarket(INITIAL_MARKETPLACE); setLocalSettings(INITIAL_SETTINGS); addAuditLog('Local Cache Reset','Defaults'); }
export function importAllDataJson(jsonData:{posts?:Post[];marketplace?:MarketplaceItem[];settings?:NoticeSettings}):boolean { try { if(jsonData.posts)setLocalPosts(jsonData.posts); if(jsonData.marketplace)setLocalMarket(jsonData.marketplace); if(jsonData.settings)setLocalSettings({...INITIAL_SETTINGS,...jsonData.settings}); addAuditLog('Data Restored','JSON Backup Imported'); return true; } catch { return false; } }
export async function performAdminLogin(emailOrUsername:string,pass:string):Promise<{email:string}> { const email=emailOrUsername.trim().toLowerCase(); if(!email.includes('@')) throw new Error('Please enter the admin email address used in Supabase Authentication.'); const client=ensureSupabase(); const {data,error}=await client.auth.signInWithPassword({email,password:pass}); if(error)throw new Error(error.message); const user=data.user; if(!user)throw new Error('Login failed.'); const allowed=(import.meta.env.VITE_ADMIN_EMAIL as string|undefined)?.trim().toLowerCase(); if(!allowed || user.email?.toLowerCase()!==allowed){ await client.auth.signOut(); throw new Error('This account is not configured as the site admin. Set VITE_ADMIN_EMAIL to your admin email.'); } const session={email:user.email??email}; setStoredAdminSession(session); addAuditLog('Admin Login','Supabase Auth',session.email); return session; }
export async function performAdminLogout() { if(supabase) await supabase.auth.signOut(); setStoredAdminSession(null); }
export const fetchPosts=fetchAllPosts; export const savePost=savePostToDb; export const deletePost=deletePostFromDb; export const bulkDeletePosts=bulkDeletePostsFromDb;
export const getInitialPosts=getLocalPosts; export const getInitialMarketplace=getLocalMarket; export const getNoticeSettings=getLocalSettings;
export const savePostToStorage=async(data:Omit<Post,'id'|'views'|'createdAt'>&{id?:string;views?:number}):Promise<Post>=>{const id=await savePostToDb(data);return (await fetchAllPosts()).find(p=>p.id===id)??({...data,id,views:data.views??0,createdAt:new Date().toISOString()} as Post);};
export const deletePostFromStorage=deletePostFromDb; export const bulkDeletePostsFromStorage=bulkDeletePostsFromDb; export const bulkPinPostsInStorage=bulkUpdatePostsPin;
export const saveMarketItemToStorage=async(data:Omit<MarketplaceItem,'id'|'createdAt'>&{id?:string}):Promise<MarketplaceItem>=>{if(data.id){await updateMarketListingDetails(data.id,data);return data as MarketplaceItem;}const {id,...rest}=data;const newId=await submitMarketListing(rest as Omit<MarketplaceItem,'id'|'status'|'createdAt'>);return getLocalMarket().find(x=>x.id===newId)!;};
export const deleteMarketItemFromStorage=deleteMarketListing; export const updateMarketItemStatusInStorage=updateMarketListingStatus;
export async function incrementPostViews(id:string) { const p=getLocalPosts().find(x=>x.id===id); if(!p)return; const next=(p.views??0)+1; const {error}=await ensureSupabase().from('posts').update({views:next}).eq('id',id); if(error)console.warn(error); setLocalPosts(getLocalPosts().map(x=>x.id===id?{...x,views:next}:x)); }
export async function incrementPostViewCount(id:string):Promise<number>{await incrementPostViews(id);return getLocalPosts().find(p=>p.id===id)?.views??1;}
export function getStoredAdminSession():{email:string}|null { try {const raw=sessionStorage.getItem(STORAGE_ADMIN_SESSION_KEY);return raw?JSON.parse(raw):null;}catch{return null;} }
export function setStoredAdminSession(session:{email:string}|null){try{if(session)sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY,JSON.stringify(session));else{sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);}}catch{}}
