import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

/**
 * MarkdownRenderer - A reusable component for rendering Markdown content
 * with beautiful syntax highlighting for code blocks.
 * 
 * Features:
 * - GitHub Flavored Markdown (tables, strikethrough, autolinks, task lists)
 * - VS Code Dark+ theme for code blocks
 * - Styled headers, lists, blockquotes, and more
 */
const MarkdownRenderer = ({ content, className = '' }) => {
  // Custom code block renderer with syntax highlighting
  const CodeBlock = ({ node, inline, className: codeClassName, children, ...props }) => {
    const match = /language-(\w+)/.exec(codeClassName || '');
    const language = match ? match[1] : '';
    
    // Inline code styling
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 bg-gray-100 text-pink-600 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }

    // Code block with syntax highlighting
    return (
      <div className="relative group my-4">
        {/* Language label */}
        {language && (
          <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-gray-400 bg-[#2d2d2d] rounded-tr-lg rounded-bl-lg border-l border-b border-gray-700">
            {language}
          </div>
        )}
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'text'}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '8px',
            padding: '1em',
            paddingTop: language ? '2em' : '1em',
            backgroundColor: '#1E1E1E',
            fontSize: '0.875rem',
            lineHeight: '1.7',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            }
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  };

  // Custom components for styled markdown elements
  const components = {
    code: CodeBlock,
    
    // Headers with gradient accent
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-4 pb-2 border-b border-gray-200">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3 pb-1 border-b border-gray-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
        {children}
      </h4>
    ),
    
    // Paragraphs
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    
    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-gray-700">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-gray-700">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    
    // Blockquotes - styled like Notion
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-4 pr-4 py-3 my-4 text-gray-700 italic rounded-r-lg">
        {children}
      </blockquote>
    ),
    
    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    
    // Tables - GitHub style
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-gray-200 bg-white">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-gray-50 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-gray-700">
        {children}
      </td>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    ),
    
    // Images
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-md max-w-full h-auto my-4"
      />
    ),
    
    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700">
        {children}
      </em>
    ),
    
    // Strikethrough (GFM)
    del: ({ children }) => (
      <del className="text-gray-500 line-through">
        {children}
      </del>
    ),
  };

  return (
    <div className={`markdown-content prose prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
