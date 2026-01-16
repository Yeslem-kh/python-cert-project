import React, { useState } from 'react';
import { Folder, FolderPlus, ChevronRight, FileText, Trash2, X, Check, MoreVertical } from 'lucide-react';

const DEFAULT_FOLDERS = [
  { id: 'all', name: 'All Notes', icon: FileText, color: 'gray', isDefault: true },
  { id: 'uncategorized', name: 'Uncategorized', icon: Folder, color: 'slate', isDefault: true },
];

const FOLDER_COLORS = [
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
  { name: 'green', bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
  { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
  { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-50' },
  { name: 'teal', bg: 'bg-teal-100', text: 'text-teal-600', hover: 'hover:bg-teal-50' },
  { name: 'red', bg: 'bg-red-100', text: 'text-red-600', hover: 'hover:bg-red-50' },
  { name: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'hover:bg-yellow-50' },
];

const FolderSidebar = ({ 
  folders, 
  selectedFolder, 
  onSelectFolder, 
  onCreateFolder, 
  onDeleteFolder,
  noteCounts 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [menuOpen, setMenuOpen] = useState(null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder({
        id: `folder-${Date.now()}`,
        name: newFolderName.trim(),
        color: selectedColor,
        isDefault: false
      });
      setNewFolderName('');
      setSelectedColor('blue');
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    if (confirm('Delete this folder? Notes will be moved to Uncategorized.')) {
      onDeleteFolder(folderId);
      setMenuOpen(null);
    }
  };

  const getColorClasses = (colorName) => {
    return FOLDER_COLORS.find(c => c.name === colorName) || FOLDER_COLORS[0];
  };

  const allFolders = [...DEFAULT_FOLDERS, ...folders];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Folders</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
          title="Create folder"
        >
          <FolderPlus size={18} />
        </button>
      </div>

      {/* Create Folder Form */}
      {isCreating && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl space-y-3 animate-fadeIn">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') setIsCreating(false);
            }}
          />
          
          {/* Color Picker */}
          <div className="flex flex-wrap gap-1.5">
            {FOLDER_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.text} flex items-center justify-center transition-all ${
                  selectedColor === color.name ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                }`}
              >
                {selectedColor === color.name && <Check size={12} />}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Folder List */}
      <div className="space-y-1">
        {allFolders.map((folder) => {
          const isSelected = selectedFolder === folder.id;
          const colorClasses = folder.isDefault 
            ? { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-50' }
            : getColorClasses(folder.color);
          const count = noteCounts[folder.id] || 0;
          
          return (
            <div
              key={folder.id}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? `${colorClasses.bg} ${colorClasses.text}` 
                  : `text-gray-600 ${colorClasses.hover}`
              }`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/50' : colorClasses.bg}`}>
                {folder.isDefault ? (
                  folder.id === 'all' ? <FileText size={16} /> : <Folder size={16} />
                ) : (
                  <Folder size={16} className={colorClasses.text} />
                )}
              </div>
              
              <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
              
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-white/50' : 'bg-gray-100'
              }`}>
                {count}
              </span>

              {/* Delete button for custom folders */}
              {!folder.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="absolute right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick tip */}
      <div className="mt-6 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-indigo-600">Tip:</span> Create folders to organize your notes by project or topic.
        </p>
      </div>
    </div>
  );
};

export { DEFAULT_FOLDERS, FOLDER_COLORS };
export default FolderSidebar;
