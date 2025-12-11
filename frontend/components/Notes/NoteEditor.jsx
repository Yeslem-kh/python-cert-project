import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Columns, Maximize2, Minimize2 } from 'lucide-react';
import MarkdownRenderer from '../Common/MarkdownRenderer';

/**
 * NoteEditor - A fixed-height split-view Markdown editor with live preview
 * Layout: Fixed header + scrollable middle + fixed footer (like VS Code/Discord)
 */
const NoteEditor = ({ 
  initialContent = '', 
  onChange, 
  placeholder = 'Write your note in Markdown...',
  height = '400px'
}) => {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'preview', 'split'
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  return (
    <div 
      className={`note-editor bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto' : ''
      }`}
      style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : height }}
    >
      {/* ========== FIXED HEADER - shrink-0 prevents collapse ========== */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-1">
          {/* Edit Mode */}
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'edit'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Edit mode"
          >
            <Edit3 size={14} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          
          {/* Split Mode */}
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Split view"
          >
            <Columns size={14} />
            <span className="hidden sm:inline">Split</span>
          </button>
          
          {/* Preview Mode */}
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Preview mode"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">
            {content.length} characters
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* ========== SCROLLABLE MIDDLE SECTION - flex-1 takes remaining space ========== */}
      <div className={`flex-1 flex overflow-hidden ${viewMode === 'split' ? 'divide-x divide-gray-200' : ''}`}>
        
        {/* Edit Panel */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col h-full overflow-hidden`}>
            {viewMode === 'split' && (
              <div className="shrink-0 px-3 py-1.5 bg-gray-50/50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Markdown
                </span>
              </div>
            )}
            {/* Textarea with h-full and overflow-y-auto for independent scrolling */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder={placeholder}
              className="flex-1 w-full p-4 resize-none focus:outline-none text-gray-800 placeholder-gray-400 leading-relaxed overflow-y-auto"
              style={{
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                fontSize: '0.9rem',
              }}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col h-full overflow-hidden`}>
            {viewMode === 'split' && (
              <div className="shrink-0 px-3 py-1.5 bg-gray-50/50 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Preview
                </span>
              </div>
            )}
            {/* Preview div with h-full and overflow-y-auto for independent scrolling */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-gray-400 text-sm">
                  <p className="mb-4">Start typing to see the preview...</p>
                  <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-2">Quick Markdown Reference:</p>
                    <ul className="text-xs space-y-1 text-gray-500">
                      <li><code className="bg-gray-100 px-1 rounded"># Header</code> - Create headers</li>
                      <li><code className="bg-gray-100 px-1 rounded">**bold**</code> - Bold text</li>
                      <li><code className="bg-gray-100 px-1 rounded">*italic*</code> - Italic text</li>
                      <li><code className="bg-gray-100 px-1 rounded">```code```</code> - Code blocks</li>
                      <li><code className="bg-gray-100 px-1 rounded">&gt; quote</code> - Blockquotes</li>
                      <li><code className="bg-gray-100 px-1 rounded">- item</code> - Lists</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========== FIXED FOOTER - shrink-0 keeps it always visible ========== */}
      <div className="shrink-0 px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>Lines: {content.split('\n').length}</span>
            <span>Words: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Markdown supported</span>
            <div className="w-2 h-2 bg-green-400 rounded-full" title="Ready"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
