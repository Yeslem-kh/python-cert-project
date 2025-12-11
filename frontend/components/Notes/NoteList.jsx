import React from 'react';
import NoteItem from './NoteItem';
import { FileText, Inbox } from 'lucide-react';

const NoteList = ({ notes, onUpdate, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="note-card animate-fadeIn">
        <div className="empty-state py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Inbox size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No notes yet</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Create your first note above! Your thoughts, ideas, and code snippets will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">My Notes</h2>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
            {notes.length}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Sorted by latest
        </p>
      </div>
      
      {/* Notes Grid */}
      <div className="grid gap-4">
        {notes.map((note, index) => (
          <div 
            key={note.id} 
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <NoteItem
              note={note}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;