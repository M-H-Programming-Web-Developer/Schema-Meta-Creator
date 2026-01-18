
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 p-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors z-10"
        title="Copy to clipboard"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
      <pre className="p-6 bg-slate-900 text-slate-300 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed max-h-[600px] border border-slate-800">
        <code>{code}</code>
      </pre>
    </div>
  );
};
