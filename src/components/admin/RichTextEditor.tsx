import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Link, 
  Unlink, 
  Table, 
  Undo, 
  Redo, 
  RemoveFormatting, 
  Code, 
  Eye, 
  FileText, 
  Minus, 
  Highlighter, 
  Palette, 
  Check, 
  X, 
  ExternalLink,
  Info,
  AlertTriangle,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing official notification details, guidelines, or paste text..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Table Modal State
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Color Palette Dropdowns
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  // Sync incoming value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current && !isSourceMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setSourceCode(value || '');
  }, [value, isSourceMode]);

  // Handle User Input in Visual Editor
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  }, [onChange]);

  // Execute formatting command
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (isSourceMode) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  // Heading / Block Format Handler
  const handleFormatBlock = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  // Color options
  const textColors = [
    { label: 'Default (Dark)', value: '#1e293b' },
    { label: 'Sarkari Blue', value: '#1d4ed8' },
    { label: 'Alert Red', value: '#dc2626' },
    { label: 'Verified Green', value: '#16a34a' },
    { label: 'Highlight Amber', value: '#d97706' },
    { label: 'Official Purple', value: '#7c3aed' }
  ];

  const highlightColors = [
    { label: 'Yellow Highlight', value: '#fef08a' },
    { label: 'Cyan Highlight', value: '#a5f3fc' },
    { label: 'Light Green', value: '#bbf7d0' },
    { label: 'Rose Light', value: '#fecdd3' },
    { label: 'Clear Highlight', value: 'transparent' }
  ];

  // Save selection before opening modal
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      setSavedRange(range);
      const text = sel.toString();
      setLinkText(text);
      
      // Check if selected element is already an anchor tag
      let node: Node | null = range.commonAncestorContainer;
      if (node.nodeType === 3 && node.parentElement) {
        node = node.parentElement;
      }
      const anchor = (node as HTMLElement).closest('a');
      if (anchor) {
        setLinkUrl(anchor.getAttribute('href') || '');
        setLinkOpenNewTab(anchor.getAttribute('target') === '_blank');
      } else {
        setLinkUrl('');
        setLinkOpenNewTab(true);
      }
    } else {
      setSavedRange(null);
      setLinkText('');
      setLinkUrl('');
    }
  };

  // Open Link Dialog
  const handleOpenLinkModal = () => {
    saveCurrentSelection();
    setIsLinkModalOpen(true);
  };

  // Apply Link Behind Text
  const handleApplyLink = () => {
    if (!linkUrl.trim()) return;
    let validUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(validUrl) && !validUrl.startsWith('/') && !validUrl.startsWith('#')) {
      validUrl = 'https://' + validUrl;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRange) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRange);
        }

        const anchor = document.createElement('a');
        anchor.href = validUrl;
        if (linkOpenNewTab) {
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
        }
        anchor.className = 'text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer';

        if (savedRange.toString().length > 0) {
          try {
            document.execCommand('createLink', false, validUrl);
            const anchors = editorRef.current.querySelectorAll(`a[href="${validUrl}"]`);
            anchors.forEach(a => {
              if (linkOpenNewTab) {
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener noreferrer');
              }
              a.className = 'text-blue-600 hover:text-blue-800 underline font-semibold';
            });
          } catch {
            savedRange.deleteContents();
            anchor.textContent = linkText.trim() || validUrl;
            savedRange.insertNode(anchor);
          }
        } else {
          anchor.textContent = linkText.trim() || validUrl;
          savedRange.insertNode(anchor);
        }
      } else {
        const anchorHtml = `<a href="${validUrl}" ${linkOpenNewTab ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-blue-600 hover:text-blue-800 underline font-semibold">${linkText.trim() || validUrl}</a>`;
        document.execCommand('insertHTML', false, anchorHtml);
      }
      handleInput();
    }
    setIsLinkModalOpen(false);
  };

  // Remove Link from selection
  const handleRemoveLink = () => {
    executeCommand('unlink');
    setIsLinkModalOpen(false);
  };

  // Insert Table
  const handleInsertTable = () => {
    const rows = Math.max(1, tableRows);
    const cols = Math.max(1, tableCols);
    let tableHtml = `<div class="overflow-x-auto my-4"><table class="w-full text-left text-xs border-collapse border border-slate-300 rounded-lg overflow-hidden my-2"><thead><tr class="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">`;
    for (let c = 1; c <= cols; c++) {
      tableHtml += `<th class="p-2.5 border border-slate-300">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let r = 1; r <= rows; r++) {
      tableHtml += `<tr class="${r % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200">`;
      for (let c = 1; c <= cols; c++) {
        tableHtml += `<td class="p-2.5 border border-slate-300">Row ${r} Col ${c}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table></div><p><br></p>`;
    executeCommand('insertHTML', tableHtml);
    setIsTableModalOpen(false);
  };

  // Insert Callout Box
  const handleInsertCallout = (type: 'info' | 'alert' | 'success') => {
    let calloutHtml = '';
    if (type === 'info') {
      calloutHtml = `
<div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
  <strong style="color: #1e40af;">📌 Important Notice:</strong>
  <p style="margin: 4px 0 0 0; color: #1e3a8a; font-size: 13px;">Candidates must verify their details with official notification before final fee submission.</p>
</div><p><br></p>`;
    } else if (type === 'alert') {
      calloutHtml = `
<div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
  <strong style="color: #991b1b;">⚠️ Warning / Last Date Alert:</strong>
  <p style="margin: 4px 0 0 0; color: #7f1d1d; font-size: 13px;">Online server may experience heavy load on the closing date. Apply well in advance.</p>
</div><p><br></p>`;
    } else {
      calloutHtml = `
<div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
  <strong style="color: #166534;">✅ Eligibility Criteria Met:</strong>
  <p style="margin: 4px 0 0 0; color: #14532d; font-size: 13px;">Direct selection is based strictly on merit list and marks obtained in intermediate examination.</p>
</div><p><br></p>`;
    }
    executeCommand('insertHTML', calloutHtml);
  };

  // Switch between Visual & HTML Source
  const toggleSourceMode = () => {
    if (isSourceMode) {
      if (editorRef.current) {
        editorRef.current.innerHTML = sourceCode;
      }
      onChange(sourceCode);
      setIsSourceMode(false);
    } else {
      if (editorRef.current) {
        const html = editorRef.current.innerHTML;
        setSourceCode(html);
        onChange(html);
      }
      setIsSourceMode(true);
    }
  };

  return (
    <div className={`border border-slate-700 rounded-2xl overflow-hidden bg-slate-900 shadow-xl transition-all ${
      isFullScreen ? 'fixed inset-4 z-50 flex flex-col bg-slate-900 shadow-2xl' : 'relative'
    }`}>
      {/* MS Word-Style Ribbon Toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 text-slate-200 select-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('undo')}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Redo size={14} />
          </button>
        </div>

        {/* Headings Selector */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700">
          <select
            onChange={(e) => handleFormatBlock(e.target.value)}
            defaultValue="<p>"
            disabled={isSourceMode}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer focus:border-[#38bdf8]"
            title="Select Text Style / Heading"
          >
            <option value="<p>">Normal Text</option>
            <option value="<h1>">Title (H1)</option>
            <option value="<h2>">Section (H2)</option>
            <option value="<h3>">Heading (H3)</option>
            <option value="<h4>">Subheading (H4)</option>
            <option value="<blockquote>">Quote Block</option>
          </select>
        </div>

        {/* Font Formats: Bold, Italic, Underline, Strike */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold (Ctrl+B)"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-bold cursor-pointer"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic (Ctrl+I)"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors italic cursor-pointer"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline (Ctrl+U)"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors underline cursor-pointer"
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            title="Strikethrough"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Strikethrough size={14} />
          </button>
        </div>

        {/* Text Color & Highlighter Dropdown */}
        <div className="relative flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              title="Font Color"
              disabled={isSourceMode}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Palette size={14} className="text-amber-400" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 shadow-2xl z-30 w-36 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">Text Color</span>
                {textColors.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      executeCommand('foreColor', c.value);
                      setShowColorPicker(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded text-xs text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: c.value }} />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              title="Text Highlight Color"
              disabled={isSourceMode}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Highlighter size={14} className="text-yellow-300" />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 bg-slate-950 border border-slate-700 rounded-xl p-2 shadow-2xl z-30 w-36 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">Highlight Color</span>
                {highlightColors.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      executeCommand('hiliteColor', c.value);
                      setShowHighlightPicker(false);
                    }}
                    className="w-full text-left px-2 py-1 rounded text-xs text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: c.value === 'transparent' ? '#334155' : c.value }} />
                    <span className="truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            title="Align Left"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            title="Center Text"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            title="Align Right"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            title="Justify"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <AlignJustify size={14} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bulleted List"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ListOrdered size={14} />
          </button>
        </div>

        {/* Hyperlink Behind Text Button */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={handleOpenLinkModal}
            title="Insert / Edit Link Behind Text (Ctrl+K)"
            disabled={isSourceMode}
            className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold border border-sky-500/40 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Link size={13} />
            <span>Link Text</span>
          </button>
          <button
            type="button"
            onClick={handleRemoveLink}
            title="Remove Link"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 cursor-pointer"
          >
            <Unlink size={13} />
          </button>
        </div>

        {/* Insert Objects: Table, Callouts, Divider */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            title="Insert Styled Table"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Table size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleInsertCallout('info')}
            title="Insert Notice Callout Box"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <Info size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleInsertCallout('alert')}
            title="Insert Warning Box"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <AlertTriangle size={14} />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertHorizontalRule')}
            title="Insert Horizontal Divider Line"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>
        </div>

        {/* Formatting Clear */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-700">
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="Clear Text Formatting"
            disabled={isSourceMode}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RemoveFormatting size={14} />
          </button>
        </div>

        {/* View Switcher: Word Page vs HTML Code */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={toggleSourceMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isSourceMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
            }`}
            title={isSourceMode ? "Switch to MS Word Visual Mode" : "Switch to Raw HTML Code View"}
          >
            {isSourceMode ? <Eye size={13} /> : <Code size={13} />}
            <span>{isSourceMode ? 'Word View' : 'HTML Code'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Document Editor"}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Editor Content Surface */}
      <div className={`p-4 sm:p-6 bg-slate-950 flex justify-center ${isFullScreen ? 'flex-1 overflow-y-auto' : ''}`}>
        {isSourceMode ? (
          <textarea
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Type or paste HTML tags here..."
            className="w-full max-w-4xl min-h-[360px] p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 outline-none resize-y leading-relaxed"
          />
        ) : (
          <div className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 p-6 sm:p-10 min-h-[380px] prose prose-slate max-w-none focus:outline-none">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              onBlur={handleInput}
              className="outline-none min-h-[320px] text-sm leading-relaxed text-slate-800 word-page-content"
              style={{
                wordBreak: 'break-word',
              }}
              data-placeholder={placeholder}
            />
          </div>
        )}
      </div>

      {/* Bottom Status bar */}
      <div className="bg-slate-800/90 border-t border-slate-700 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FileText size={12} className="text-sky-400" />
            <span>Word Document Mode: <strong>{isSourceMode ? 'HTML Source' : 'Visual WYSIWYG'}</strong></span>
          </span>
          <span>•</span>
          <span>Tip: Highlight any words and click <strong>"Link Text"</strong> to hide a web URL behind text</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          Nikhil Talks Word Editor
        </div>
      </div>

      {/* Modal: Insert / Edit Hyperlink Behind Text */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Link size={16} className="text-sky-400" />
                <span>Insert Hyperlink Behind Text</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Display Text (What readers will see)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Click Here to Apply Online"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-[#38bdf8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Web Address / URL (Destination Link) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://onlinebssc.com/ or https://gov-portal.in"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-[#38bdf8]"
                  />
                  {linkUrl && (
                    <a
                      href={linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-300 p-1"
                      title="Test URL in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  When users click this text on your portal, it will redirect directly to this link.
                </p>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkOpenNewTab}
                    onChange={(e) => setLinkOpenNewTab(e.target.checked)}
                    className="rounded text-sky-500"
                  />
                  <span>Open link in new browser tab (_blank)</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleRemoveLink}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Unlink size={13} />
                <span>Remove Link</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  disabled={!linkUrl.trim()}
                  className="btn-3d btn-primary btn-sm text-xs font-bold py-1.5 px-4 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>Attach Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Insert Styled Table */}
      {isTableModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Table size={16} className="text-sky-400" />
                <span>Insert Styled Table</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Columns</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="btn-3d btn-primary btn-sm text-xs font-bold py-1.5 px-4 cursor-pointer"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
