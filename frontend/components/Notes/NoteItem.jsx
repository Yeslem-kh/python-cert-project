import React, { useState } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';

const NoteItem = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: note.title, content: note.content });
  const [loading, setLoading] = useState(false);

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

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          
          <textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
            disabled={loading}
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 p-2 transition"
            title="Edit note"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700 p-2 transition disabled:opacity-50"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-700 whitespace-pre-wrap mb-4">{note.content}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <span>Updated: {new Date(note.updatedAt).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
};

export default NoteItem;