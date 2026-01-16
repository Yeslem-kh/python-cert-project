import React, { useState } from 'react';
import { Plus, FileText, Sparkles, ChevronDown, ChevronUp, Folder } from 'lucide-react';
import NoteEditor from './NoteEditor';
import { FOLDER_COLORS } from './FolderSidebar';

const NoteForm = ({ onSubmit, folders = [], selectedFolder }) => {
  const [formData, setFormData] = useState({ title: '', content: '', folderId: selectedFolder || 'uncategorized' });
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update folderId when selectedFolder changes
  React.useEffect(() => {
    if (selectedFolder && selectedFolder !== 'all') {
      setFormData(prev => ({ ...prev, folderId: selectedFolder }));
    }
  }, [selectedFolder]);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData.title, formData.content, formData.folderId);
      setFormData({ title: '', content: '', folderId: selectedFolder || 'uncategorized' });
      setIsExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (colorName) => {
    return FOLDER_COLORS.find(c => c.name === colorName) || FOLDER_COLORS[0];
  };

  const handleContentChange = (newContent) => {
    setFormData({ ...formData, content: newContent });
  };

  return (
    <div className="note-card mb-6 animate-fadeIn overflow-hidden">
      {/* Header - Click to toggle */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Plus size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Create New Note</h2>
            <p className="text-xs text-gray-400">
              {isExpanded ? 'Write in Markdown with live preview' : 'Click to start writing'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Sparkles size={16} />
          <span className="text-xs font-medium hidden sm:inline">Markdown supported</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      
      {/* Expandable Form - Fixed height container */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <div className="p-4 space-y-4">
            {/* Title Input - Fixed at top */}
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 placeholder-gray-400 font-medium"
                disabled={loading}
              />
            </div>

            {/* Folder Selector */}
            <div className="relative">
              <Folder size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.folderId}
                onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-medium appearance-none cursor-pointer"
                disabled={loading}
              >
                <option value="uncategorized">Uncategorized</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Markdown Editor - Fixed height with internal scroll */}
            <NoteEditor
              initialContent={formData.content}
              onChange={handleContentChange}
              placeholder="Write your note in Markdown...

# Example Header

You can use **bold**, *italic*, and `code`.

```javascript
// Code blocks are supported!
console.log('Hello, World!');
```

> Blockquotes look great too!"
              height="350px"
            />
            
            {/* Action Buttons - Fixed at bottom */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                  setFormData({ title: '', content: '' });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Note
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteForm;