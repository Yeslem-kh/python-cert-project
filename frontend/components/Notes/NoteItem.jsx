import React, { useState } from 'react';
import { Edit2, Trash2, Save, X, Clock, Calendar, FileText } from 'lucide-react';
import MarkdownRenderer from '../Common/MarkdownRenderer';
import NoteEditor from './NoteEditor';

const NoteItem = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: note.title, content: note.content });
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setLoading(true);
    try {
      await onUpdate(note.id, editData.title, editData.content);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ title: note.title, content: note.content });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    setLoading(true);
    try {
      await onDelete(note.id);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (newContent) => {
    setEditData({ ...editData, content: newContent });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isEditing) {
    return (
      <div className="note-card p-5 overflow-hidden">
        <div className="space-y-4">
          {/* Edit Title - Fixed at top */}
          <div className="relative shrink-0">
            <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-gray-800 font-medium"
              disabled={loading}
              placeholder="Note title..."
            />
          </div>
          
          {/* Markdown Editor - Fixed height with internal scroll */}
          <NoteEditor
            initialContent={editData.content}
            onChange={handleContentChange}
            placeholder="Edit your note in Markdown..."
            height="300px"
          />
          
          {/* Edit Actions - Fixed at bottom */}
          <div className="flex items-center justify-end gap-2 pt-2 shrink-0">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md shadow-green-500/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="note-card group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate pr-4">
            {note.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={12} />
              {formatDate(note.createdAt)}
            </span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                Edited
              </span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Edit note"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Card Content - Now using MarkdownRenderer */}
      <div className="p-5 pt-3">
        <div className="note-content text-gray-600">
          <MarkdownRenderer content={note.content} />
        </div>
      </div>
      
      {/* Card Footer - Visual indicator */}
      <div className="h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 group-hover:via-indigo-500/30 transition-all" />
    </div>
  );
};

export default NoteItem;