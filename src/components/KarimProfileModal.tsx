import React, { useState } from 'react';
import { X, Upload, RotateCcw, Brain, UserCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
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
    if (!file.type.startsWith('image/')) { setFileError('Harap pilih file gambar (PNG, JPG, WebP).'); return; }
    if (file.size > 5 * 1024 * 1024) { setFileError('Ukuran file maksimal 5MB.'); return; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#4c4145]/35">
      <div className="bg-white w-full max-w-lg rounded-[26px] shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="relative bg-[#fff1d5] p-5 text-center border-b-2 border-[#ead7b6]">
          <button onClick={onClose} className="absolute top-3 right-3 p-2 text-[#806d60] hover:bg-[#f7e8ca] rounded-xl">
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <KarimAvatar customArtworkUrl={karimArtworkUrl} size="xl" showStatusDot={true} className="mb-2" />
            <h2 className="text-xl font-extrabold text-[#4b3b42]">Karim</h2>
            <p className="text-xs text-[#a1846c] font-bold mt-0.5">Siswa SMKN 2 Cilaku</p>
          </div>
        </div>

        <div className="flex border-b-2 border-[#ead7b6] bg-[#fff5df]">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeTab === 'info' ? 'border-[#8d7288] text-[#8d7288] bg-[#fffaf0]' : 'border-transparent text-[#a1846c]'}`}>
            <UserCheck className="w-4 h-4" /> Profil
          </button>
          <button onClick={() => setActiveTab('memories')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeTab === 'memories' ? 'border-[#8d7288] text-[#8d7288] bg-[#fffaf0]' : 'border-transparent text-[#a1846c]'}`}>
            <Brain className="w-4 h-4" /> Memori ({memories.length})
          </button>
          <button onClick={() => setActiveTab('artwork')} className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeTab === 'artwork' ? 'border-[#8d7288] text-[#8d7288] bg-[#fffaf0]' : 'border-transparent text-[#a1846c]'}`}>
            <ImageIcon className="w-4 h-4" /> Artwork
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-[#fff5df] p-4 rounded-2xl border-2 border-[#ead7b6] space-y-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#a1846c] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8d7288]" /> Profil Singkat
                </h3>
                <p className="text-[#6e5c59] leading-relaxed">
                  Teman sekolahmu di SMKN 2 Cilaku. Karim kadang jahil dan suka meledek, tapi biasanya tetap perhatian kalau kamu sedang butuh bantuan.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f3e8f0] rounded-2xl border border-[#decbd9]">
                  <span className="text-[10px] text-[#8d7288] font-bold block uppercase">Status Kedekatan</span>
                  <span className="font-extrabold text-[#5b4657] text-sm">{relationship.stageName}</span>
                </div>
                <div className="p-3 bg-[#f1e9e4] rounded-2xl border border-[#e1d0c7]">
                  <span className="text-[10px] text-[#9a7667] font-bold block uppercase">Sifat Utama</span>
                  <span className="font-extrabold text-[#664e47] text-sm">Jahil & perhatian</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#a1846c]">Catatan tentang Karim</h3>
                <ul className="space-y-1.5 text-xs text-[#6e5c59] list-disc list-inside">
                  <li>Suka mengeluh bangun pagi tapi sering datang lebih awal.</li>
                  <li>Sering pura-pura lupa padahal ingat detail obrolan kalian.</li>
                  <li>Suka pesan es teh manis di kantin Mbok Jum.</li>
                  <li>Kalau sudah akrab, godaannya makin banyak.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-3">
              <p className="text-xs text-[#a1846c]">Hal penting yang diingat Karim dari percakapan kalian:</p>
              {memories.length === 0 ? (
                <div className="text-center py-8 text-[#a1846c] text-xs">Belum ada memori khusus. Teruslah mengobrol dengan Karim!</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {memories.map((mem) => (
                    <div key={mem.id} className="p-3 bg-[#fff5df] rounded-2xl border-2 border-[#ead7b6] text-xs flex items-start gap-2">
                      <span className="p-1 rounded-md bg-[#f3e8f0] text-[#8d7288] font-bold uppercase text-[9px] mt-0.5">{mem.category}</span>
                      <p className="flex-1 text-[#5b4c4a] leading-snug">{mem.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'artwork' && (
            <div className="space-y-4">
              <div className="text-xs text-[#6e5c59] leading-relaxed">Kamu bisa mengunggah artwork asli Karim sendiri untuk dipakai di chat.</div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#fff5df] rounded-2xl border-2 border-dashed border-[#dfc79f]">
                <KarimAvatar customArtworkUrl={karimArtworkUrl} size="xl" showStatusDot={false} className="mb-3" />
                <span className="text-xs font-bold text-[#a1846c]">{karimArtworkUrl ? 'Artwork Kustom Aktif' : 'Artwork Default Aktif'}</span>
              </div>
              {fileError && <div className="p-2.5 bg-[#fae1e3] text-[#a75f70] text-xs rounded-xl border border-[#e8bfc7]">{fileError}</div>}
              <div className="flex gap-2">
                <label className="flex-1 py-2.5 px-4 bg-[#8d7288] hover:bg-[#795f75] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <Upload className="w-4 h-4" /> Unggah Gambar Baru
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileUpload} className="hidden" />
                </label>
                {karimArtworkUrl && (
                  <button onClick={() => { onUpdateArtwork(undefined); setActiveTab('info'); }} className="py-2.5 px-3 bg-[#f4edda] hover:bg-[#eadfc2] text-[#6e5c59] rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4" /> Reset
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
