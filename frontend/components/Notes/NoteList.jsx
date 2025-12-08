import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onUpdate, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">📝 No notes yet</p>
        <p className="text-gray-400 text-sm mt-2">Create your first note above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        My Notes
        <span className="text-sm font-normal text-gray-500">({notes.length})</span>
      </h2>
      
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NoteList;