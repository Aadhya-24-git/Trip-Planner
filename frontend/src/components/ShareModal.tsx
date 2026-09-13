import React, { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  shareUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, tripTitle, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const url = shareUrl || window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Trip link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">Share This Trip</h3>
            <p className="text-xs text-slate-500">Send this plan to family and friends</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
          <p className="font-bold text-slate-900 line-clamp-1">{tripTitle}</p>
          <p className="text-slate-500 text-[11px] mt-0.5">YatraPlan Verified Custom Itinerary</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Trip Shareable Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-100 text-xs font-semibold text-slate-800 border border-stone-200 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
