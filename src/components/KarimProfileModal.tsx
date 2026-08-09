import React, { useState } from 'react';
import { X, Upload, RotateCcw, Brain, UserCheck, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { MemoryItem, RelationshipState } from '../types';
import { KarimAvatar } from './KarimAvatar';

interface KarimProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  karimArtworkUrl?: string;
  onUpdateArtwork: (url?: string) => void;
  memories: MemoryItem[];
  relationship: RelationshipState;
}

export const KarimProfileModal: React.FC<KarimProfileModalProps> = ({
  isOpen,
  onClose,
  karimArtworkUrl,
  onUpdateArtwork,
  memories,
  relationship,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'memories' | 'artwork'>('info');
  const [fileError, setFileError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Harap pilih file gambar (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('Ukuran file maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateArtwork(reader.result);
        setFileError('');
        setActiveTab('info');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="relative bg-slate-100 dark:bg-zinc-800 p-5 text-slate-900 dark:text-zinc-100 text-center border-b border-slate-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <KarimAvatar
              customArtworkUrl={karimArtworkUrl}
              size="xl"
              showStatusDot={true}
              className="shadow-sm mb-2"
            />
            <h2 className="text-xl font-bold">Karim</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
              Siswa Kelas 11-B • SMA Garuda
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Biodata
          </button>
          <button
            onClick={() => setActiveTab('memories')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'memories'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            Memori ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab('artwork')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'artwork'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Artwork
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200 text-sm">
          {activeTab === 'info' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Profil Singkat
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Sahabat kamu sejak kelas 10 SMA Garuda. Kelihatannya agak judes dan tsundere kalau disapa duluan, padahal kalau kamu kenapa-napa, dia yang paling perhatian.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block uppercase">
                    Status Hubungan
                  </span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                    {relationship.stageName}
                  </span>
                </div>
                <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/50">
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block uppercase">
                    Sifat Utama
                  </span>
                  <span className="font-bold text-purple-900 dark:text-purple-200 text-sm">
                    Tsundere & Jahil
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Ciri-Ciri Karim:
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>Suka mengeluh bangun pagi tapi selalu nyampe sekolah awal.</li>
                  <li>Sering pura-pura lupa padahal ingat semua detail tentangmu.</li>
                  <li>Senang pesen es teh manis di kantin Mbok Jum.</li>
                  <li>Nggak pernah mau ngaku kalau lagi cemburu.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semua hal penting yang diingat Karim dari percakapan kalian:
              </p>

              {memories.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada memori khusus tersimpan. Teruslah mengobrol dengan Karim!
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {memories.map((mem) => (
                    <div
                      key={mem.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-start gap-2"
                    >
                      <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold uppercase text-[9px] mt-0.5">
                        {mem.category}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-800 dark:text-slate-200 leading-snug">{mem.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'artwork' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kamu bisa mengunggah artwork asli Karim buatanmu sendiri untuk ditampilkan sepanjang permainan.
              </div>

              {/* Artwork Preview Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <KarimAvatar
                  customArtworkUrl={karimArtworkUrl}
                  size="xl"
                  showStatusDot={false}
                  className="shadow-md mb-3"
                />
                <span className="text-xs font-medium text-slate-500">
                  {karimArtworkUrl ? 'Artwork Kustom Aktif' : 'Artwork Default Aktif'}
                </span>
              </div>

              {fileError && (
                <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {fileError}
                </div>
              )}

              <div className="flex gap-2">
                <label className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
                  <Upload className="w-4 h-4" />
                  Unggah Gambar Baru
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {karimArtworkUrl && (
                  <button
                    onClick={() => {
                      onUpdateArtwork(undefined);
                      setActiveTab('info');
                    }}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Riset ke Artwork Default"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
