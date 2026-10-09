import React, { useState } from 'react';
import { 
  Edit, 
  Star, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Wand2, 
  Clock, 
  GraduationCap, 
  Users, 
  IndianRupee, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { Post, PostCategory, QuickInfoRow, ImportantLinkRow } from '../../types';
import { RichTextEditor } from './RichTextEditor';

interface PostEditorTabProps {
  editingPostId: string | null;
  initialPost?: Post | null;
  onSavePost: (postData: Omit<Post, 'id' | 'views' | 'createdAt'> & { id?: string; views?: number }) => Promise<void>;
  onCancel: () => void;
}

export const PostEditorTab: React.FC<PostEditorTabProps> = ({
  editingPostId,
  initialPost,
  onSavePost,
  onCancel
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [category, setCategory] = useState<PostCategory>(initialPost?.category || 'Jobs');
  const [tags, setTags] = useState(initialPost?.tags?.join(', ') || '');
  const [summary, setSummary] = useState(initialPost?.summary || '');
  const [body, setBody] = useState(initialPost?.body || '');
  const [isPinned, setIsPinned] = useState(!!initialPost?.isPinned);
  const [isDraft, setIsDraft] = useState(!!initialPost?.isDraft);
  const [lastDate, setLastDate] = useState(initialPost?.lastDate || '');
  const [qualification, setQualification] = useState(initialPost?.qualification || '');
  const [salaryInfo, setSalaryInfo] = useState(initialPost?.salaryInfo || '');
  const [totalVacancies, setTotalVacancies] = useState(initialPost?.totalVacancies || '');

  const [quickInfoRows, setQuickInfoRows] = useState<QuickInfoRow[]>(
    initialPost?.quickInfo && initialPost.quickInfo.length > 0
      ? initialPost.quickInfo
      : [
          { key: 'Application Start Date', val: '15 January 2026' },
          { key: 'Last Date to Apply', val: '31 March 2026' },
          { key: 'Application Fee', val: 'Gen/OBC: ₹540 | SC/ST: ₹135' },
          { key: 'Total Vacancies', val: '12,199 Posts' }
        ]
  );

  const [importantLinks, setImportantLinks] = useState<ImportantLinkRow[]>(
    initialPost?.importantLinks && initialPost.importantLinks.length > 0
      ? initialPost.importantLinks
      : [
          { label: 'Apply Online (Registration)', url: 'https://onlinebssc.com/', status: 'active' },
          { label: 'Official Notification PDF', url: 'https://bssc.bihar.gov.in/', status: 'active' }
        ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Quick Info Row Handlers
  const addQuickInfoRow = () => {
    setQuickInfoRows([...quickInfoRows, { key: '', val: '' }]);
  };

  const updateQuickInfo = (index: number, field: 'key' | 'val', val: string) => {
    const updated = [...quickInfoRows];
    updated[index][field] = val;
    setQuickInfoRows(updated);
  };

  const removeQuickInfo = (index: number) => {
    setQuickInfoRows(quickInfoRows.filter((_, i) => i !== index));
  };

  // Important Link Row Handlers
  const addLinkRow = () => {
    setImportantLinks([...importantLinks, { label: '', url: '', status: 'active' }]);
  };

  const updateLink = (index: number, field: keyof ImportantLinkRow, val: string) => {
    const updated = [...importantLinks];
    // @ts-expect-error dynamic key assignment
    updated[index][field] = val;
    setImportantLinks(updated);
  };

  const removeLink = (index: number) => {
    setImportantLinks(importantLinks.filter((_, i) => i !== index));
  };

  // One-Click Sarkari Notice Templates
  const applyTemplate = (type: 'police' | 'ssc' | 'board' | 'scholarship' | 'yojna') => {
    if (type === 'police') {
      setTitle('Bihar Police Constable & Sub Inspector Recruitment 2026 Online Form');
      setCategory('Jobs');
      setQualification('10+2 (Inter) Pass');
      setTotalVacancies('21,391 Posts');
      setSalaryInfo('₹21,700 - ₹69,100/mo');
      setLastDate('2026-04-25');
      setTags('bihar police, constable, csbc, 10+2 jobs, physical test');
      setSummary('Central Selection Board of Constable (CSBC) has opened online application for 21,391 Constable posts. Check height, chest, running and physical criteria.');
      setBody(`<h3>CSBC Bihar Police Constable Notification 2026</h3>
<p>Eligible candidates can submit online application for Bihar Police Constable recruitment. Minimum qualification is 10+2 (Intermediate) from any recognized board.</p>
<h4>Physical Eligibility:</h4>
<ul>
  <li>Height: Male Gen/BC: 165 CM | EBC/SC/ST: 160 CM | All Females: 155 CM</li>
  <li>Chest: 81-86 CM (Male only)</li>
  <li>Running: 1.6 KM in 6 Minutes (Male) | 1 KM in 5 Minutes (Female)</li>
</ul>`);
      setQuickInfoRows([
        { key: 'Application Start Date', val: '20 February 2026' },
        { key: 'Last Date to Apply', val: '25 April 2026' },
        { key: 'Application Fee', val: 'General/EWS/BC: ₹675 | SC/ST: ₹180' },
        { key: 'Age Limit (18-25 Yrs)', val: 'As per CSBC Rules' }
      ]);
      setImportantLinks([
        { label: 'Apply Online', url: 'https://csbc.bih.nic.in/', status: 'active' },
        { label: 'Download Syllabus PDF', url: 'https://csbc.bih.nic.in/', status: 'active' },
        { label: 'Official Portal', url: 'https://csbc.bih.nic.in/', status: 'active' }
      ]);
    } else if (type === 'ssc') {
      setTitle('SSC Combined Graduate Level (CGL) 2026 Notification & Apply Online');
      setCategory('Jobs');
      setQualification('Graduation in Any Stream');
      setTotalVacancies('14,500+ Posts');
      setSalaryInfo('₹35,400 - ₹1,42,400/mo');
      setLastDate('2026-05-15');
      setTags('ssc, cgl, inspector, assistant section officer, graduation');
      setSummary('Staff Selection Commission conducts CGL 2026 for recruitment to Group B and C gazetted/non-gazetted posts across central government ministries.');
      setBody(`<h3>SSC CGL Examination 2026 Highlights</h3>
<p>Commission invites online applications for Combined Graduate Level examination across India. Exam will be held in Computer Based Examination (CBE) mode.</p>`);
      setQuickInfoRows([
        { key: 'Application Start Date', val: '10 March 2026' },
        { key: 'Last Date to Apply', val: '15 May 2026' },
        { key: 'Application Fee', val: '₹100 (Women/SC/ST/ESM: Exempted)' },
        { key: 'Tier-1 Exam Date', val: 'July - August 2026' }
      ]);
      setImportantLinks([
        { label: 'Apply Online (New One-Time Registration)', url: 'https://ssc.gov.in/', status: 'active' },
        { label: 'Official Notification PDF', url: 'https://ssc.gov.in/', status: 'active' }
      ]);
    } else if (type === 'board') {
      setTitle('Bihar Board (BSEB) Inter & Matric Result 2026 Direct Link Active');
      setCategory('Notices');
      setQualification('10th / 12th Appearing');
      setTotalVacancies('16 Lakh+ Students');
      setSalaryInfo('Scorecard Download');
      setLastDate('');
      setTags('bseb, bihar board, inter result, matric, roll code');
      setSummary('Bihar School Examination Board (BSEB) has announced annual secondary & higher secondary annual examination results. Check marksheet with Roll Code & Roll No.');
      setBody(`<h3>BSEB Bihar Board Exam Result 2026</h3>
<p>Students can check their subject-wise marksheet and download official digital passing certificates from the direct server links below.</p>`);
      setQuickInfoRows([
        { key: 'Exam Authority', val: 'Bihar School Examination Board (BSEB Patna)' },
        { key: 'Required Login Credentials', val: 'Roll Code & Roll Number' },
        { key: 'Result Mode', val: 'Online Digital Marksheet' }
      ]);
      setImportantLinks([
        { label: 'Server 1: Check Inter 12th Result', url: 'https://results.biharboardonline.com/', status: 'active' },
        { label: 'Server 2: Check Matric 10th Result', url: 'https://biharboardonline.bihar.gov.in/', status: 'active' }
      ]);
    } else if (type === 'scholarship') {
      setTitle('National Scholarship Portal (NSP 2025-26) Fresh & Renewal Registration');
      setCategory('Scholarships');
      setQualification('Class 1st to PG / Professional');
      setTotalVacancies('Central Sector & Post Matric');
      setSalaryInfo('Up to ₹50,000/year');
      setLastDate('2026-04-30');
      setTags('nsp, scholarship, minority, sc st, post matric, dbt');
      setSummary('Ministry of Social Justice & Education invites applications for Pre-Matric, Post-Matric, and Merit-cum-Means scholarships directly disbursed via DBT.');
      setBody(`<h3>National Scholarship Scheme Guidelines 2025-26</h3>
<p>Students must complete Biometric Aadhaar authentication at their institution or CSC before final submission.</p>`);
      setQuickInfoRows([
        { key: 'Scheme Category', val: 'Pre-Matric, Post-Matric, Higher Education' },
        { key: 'Disbursement Method', val: 'Direct Benefit Transfer (DBT) Aadhaar Linked Bank' },
        { key: 'Mandatory KYC', val: 'Aadhaar Face / Biometric Authentication' }
      ]);
      setImportantLinks([
        { label: 'NSP Student Login / Registration', url: 'https://scholarships.gov.in/', status: 'active' },
        { label: 'Check PFMS Payment Status', url: 'https://pfms.nic.in/', status: 'active' }
      ]);
    } else if (type === 'yojna') {
      setTitle('PM Kisan Samman Nidhi 19th Installment ₹2,000 Beneficiary Status');
      setCategory('Sarkari Yojna');
      setQualification('Eligible Landholding Farmers');
      setTotalVacancies('9.5 Crore+ Beneficiaries');
      setSalaryInfo('₹2,000 Installment (₹6,000/yr)');
      setLastDate('');
      setTags('pm kisan, 19th installment, dbt, ekvc, sarkari yojna');
      setSummary('Central Government releases 19th installment of PM-KISAN. Verify your Aadhaar seeding and eKYC status to receive instant payment in your bank account.');
      setBody(`<h3>Pradhan Mantri Kisan Samman Nidhi Details</h3>
<p>Beneficiaries whose bank accounts are active and Aadhaar NPCI mapped will receive ₹2,000 payment directly.</p>`);
      setQuickInfoRows([
        { key: 'Installment Amount', val: '₹2,000 per eligible farmer' },
        { key: 'Mandatory Requirement', val: 'OTP or Biometric e-KYC' },
        { key: 'Helpline Number', val: '155261 / 1800115526' }
      ]);
      setImportantLinks([
        { label: 'Check Beneficiary Status Online', url: 'https://pmkisan.gov.in/', status: 'active' },
        { label: 'Complete OTP e-KYC Now', url: 'https://pmkisan.gov.in/', status: 'active' }
      ]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a post title');
      return;
    }
    setIsSaving(true);
    try {
      const parsedTags = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const validQuickInfo = quickInfoRows.filter(r => r.key.trim() && r.val.trim());
      const validLinks = importantLinks.filter(l => l.label.trim() && l.url.trim());

      await onSavePost({
        id: editingPostId || undefined,
        title: title.trim(),
        category,
        tags: parsedTags,
        summary: summary.trim(),
        body: body.trim(),
        isPinned,
        isDraft,
        lastDate: lastDate.trim(),
        qualification: qualification.trim(),
        salaryInfo: salaryInfo.trim(),
        totalVacancies: totalVacancies.trim(),
        quickInfo: validQuickInfo,
        importantLinks: validLinks,
        views: initialPost?.views || 0
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Edit size={18} className="text-[#38bdf8]" />
            <span>{editingPostId ? 'Edit Post & Notification' : 'Create New Official Notification'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft high-converting Sarkari job updates with structured links, dates, and live visual preview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showLivePreview
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'
            }`}
          >
            {showLivePreview ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showLivePreview ? 'Hide Preview' : 'Live Preview'}</span>
          </button>
          {editingPostId && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-700/80 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {savedToast && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} />
          <span>Post successfully saved to Nikhil Talks database!</span>
        </div>
      )}

      {/* Instant Template Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-2.5">
          <Wand2 size={14} />
          <span>Quick 1-Click Sarkari Templates (Auto-fills dates, fees & tables)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyTemplate('police')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            👮 Police / Defence 10+2
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('ssc')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            👔 Graduate SSC CGL
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('board')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            📜 Board Exam / Results
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('scholarship')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            🎓 NSP Scholarships
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('yojna')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            🌾 PM Kisan Yojna (DBT)
          </button>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Post Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Bihar SSC Inter Level 2026 Online Form Reopened"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-[#38bdf8] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as PostCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-[#38bdf8] outline-none"
            >
              <option value="Jobs">Jobs</option>
              <option value="Notices">Notices</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Sarkari Yojna">Sarkari Yojna</option>
            </select>
          </div>
        </div>

        {/* Highlight Specifications */}
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Star size={13} />
              <span>Key Metadata & Quick Specs</span>
            </h4>
            <div className="flex items-center gap-3">
              {/* Draft toggle */}
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDraft}
                  onChange={e => setIsDraft(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className={isDraft ? 'text-amber-400' : 'text-slate-400'}>Save as Draft</span>
              </label>
              {/* Pin toggle */}
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className={isPinned ? 'text-amber-400' : 'text-slate-400'}>⭐ Pin to Top (Featured)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Clock size={11} className="text-rose-400" />
                <span>Last Date to Apply</span>
              </label>
              <input
                type="date"
                value={lastDate}
                onChange={e => setLastDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <GraduationCap size={11} className="text-blue-400" />
                <span>Eligibility / Qualification</span>
              </label>
              <input
                type="text"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                placeholder="e.g. 10+2 / Graduate"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Users size={11} className="text-blue-400" />
                <span>Total Vacancies / Seats</span>
              </label>
              <input
                type="text"
                value={totalVacancies}
                onChange={e => setTotalVacancies(e.target.value)}
                placeholder="e.g. 12,199 Posts"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <IndianRupee size={11} className="text-emerald-400" />
                <span>Pay Scale / Salary</span>
              </label>
              <input
                type="text"
                value={salaryInfo}
                onChange={e => setSalaryInfo(e.target.value)}
                placeholder="e.g. ₹19,900 - ₹63,200/mo"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="bssc, inter level, admit card, 10+2, sarkari result"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Summary Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Short Summary / Overview (Card Snippet) *
          </label>
          <textarea
            rows={2}
            required
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="2-3 sentence overview shown in the main feed card..."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-[#38bdf8] outline-none"
          />
        </div>

        {/* Rich Text MS Word-Style Article Body Editor */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase block">
                Article Body & Notification Details (MS Word Visual Editor)
              </label>
              <p className="text-[11px] text-slate-400">
                WYSIWYG Word formatting: format headings, insert tables, colors, callout boxes, and link URLs behind highlighted text.
              </p>
            </div>
          </div>
          <RichTextEditor
            value={body}
            onChange={setBody}
            placeholder="Type or paste eligibility details, important instructions, examination patterns, or attach links behind text..."
          />
        </div>

        {/* Dynamic Quick Info Builder */}
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Quick Summary Table Rows (Classic Sarkari Portal Look)
              </h4>
              <p className="text-[11px] text-slate-400">Renders as high-contrast Key/Value table on post detail page.</p>
            </div>
            <button
              type="button"
              onClick={addQuickInfoRow}
              className="btn-3d btn-primary btn-sm text-xs font-bold py-1.5 px-3 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Row</span>
            </button>
          </div>
          <div className="space-y-2">
            {quickInfoRows.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Application Fee"
                  value={row.key}
                  onChange={e => updateQuickInfo(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="e.g. General/OBC: ₹540 | SC/ST: ₹135"
                  value={row.val}
                  onChange={e => updateQuickInfo(idx, 'val', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeQuickInfo(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Remove row"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Official Links Builder */}
        <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Official Direct Access Links Table
              </h4>
              <p className="text-[11px] text-slate-400">Direct apply links, syllabus PDF, result portal with live status badges.</p>
            </div>
            <button
              type="button"
              onClick={addLinkRow}
              className="btn-3d btn-primary btn-sm text-xs font-bold py-1.5 px-3 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Link</span>
            </button>
          </div>
          <div className="space-y-2">
            {importantLinks.map((link, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Link Title (e.g. Apply Online)"
                  value={link.label}
                  onChange={e => updateLink(idx, 'label', e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
                <input
                  type="url"
                  placeholder="https://official-portal.gov.in/..."
                  value={link.url}
                  onChange={e => updateLink(idx, 'url', e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
                <select
                  value={link.status}
                  onChange={e => updateLink(idx, 'status', e.target.value)}
                  className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                >
                  <option value="active">Active (Green Click Here)</option>
                  <option value="soon">Coming Soon (Amber)</option>
                  <option value="expired">Expired (Red)</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="p-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Remove link"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Screen (if toggled) */}
        {showLivePreview && (
          <div className="bg-slate-900 border-2 border-sky-500/50 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} />
                <span>Live Portal Output Preview</span>
              </span>
              <span className="text-[11px] text-slate-400">Updates as you type</span>
            </div>
            {/* Previewing the Card */}
            <div className="bg-white rounded-2xl p-4 text-slate-900 max-w-sm mx-auto shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white">
                  {category}
                </span>
                {isPinned && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} className="fill-amber-500" /> Featured
                  </span>
                )}
              </div>
              {lastDate && (
                <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold mb-1.5 inline-block">
                  Last Date: {lastDate}
                </div>
              )}
              <h4 className="text-sm font-bold line-clamp-2 mb-1">{title || 'Post Title Preview'}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2">{summary || 'Summary description here...'}</p>
              <button type="button" className="btn-3d btn-primary btn-sm w-full text-xs font-bold py-1.5">
                View Details & Apply
              </button>
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-700">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-3d btn-primary py-3 px-8 text-sm font-bold flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>
              {isSaving
                ? 'Saving Post...'
                : editingPostId
                ? 'Update Notification'
                : isDraft
                ? 'Save Draft'
                : 'Publish Live to Portal'}
            </span>
          </button>
          {editingPostId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
