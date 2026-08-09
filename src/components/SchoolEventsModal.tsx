import React from 'react';
import { X, Calendar, MapPin, School, BookOpen, Clock3, Info } from 'lucide-react';
import { SchoolEvent } from '../types';

interface SchoolEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: SchoolEvent;
  onSelectEvent: (event: SchoolEvent) => void;
}

export const SchoolEventsModal: React.FC<SchoolEventsModalProps> = ({
  isOpen,
  onClose,
  currentEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4c4145]/35 p-3">
      <div className="w-full max-w-md overflow-hidden rounded-[26px] border-2 border-[#ead7b6] bg-[#fffaf0] shadow-[0_12px_0_rgba(76,65,69,.12)]">
        <div className="flex items-center justify-between border-b-2 border-[#ead7b6] bg-[#fff1d5] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e7f0c8] p-2 text-[#66734b]">
              <School size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#a1846c]">Tentang cerita</p>
              <h2 className="text-lg font-extrabold text-[#4b3b42]">SMKN 2 Cilaku</h2>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-[#806d60] hover:bg-[#f7e8ca]" title="Tutup">
            <X size={19} />
          </button>
        </div>

        <div className="space-y-3 p-5 text-[#5b4c4a]">
          <div className="rounded-2xl border-2 border-[#ead7b6] bg-[#fff5df] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#8d7288]">
              <Info size={17} />
              <span className="text-xs font-extrabold uppercase tracking-wider">Alur tetap berjalan</span>
            </div>
            <p className="text-sm leading-relaxed">
              Menu ini cuma untuk melihat konteks sekolah. Memilihnya tidak mengganti suasana, event, atau arah cerita Karim.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border-2 border-[#ead7b6] bg-[#fff5df] p-3">
              <Clock3 className="mb-2 text-[#a1846c]" size={18} />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a1846c]">Sekarang</p>
              <p className="mt-0.5 text-sm font-bold text-[#4b3b42]">{currentEvent.period}</p>
            </div>
            <div className="rounded-2xl border-2 border-[#ead7b6] bg-[#fff5df] p-3">
              <MapPin className="mb-2 text-[#bb687c]" size={18} />
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a1846c]">Lokasi cerita</p>
              <p className="mt-0.5 text-sm font-bold text-[#4b3b42]">{currentEvent.location}</p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#ead7b6] bg-[#f4edda] p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 shrink-0 text-[#8d7288]" size={18} />
              <div>
                <p className="font-extrabold text-[#4b3b42]">Konteks sekolah</p>
                <p className="mt-1 text-xs leading-relaxed text-[#806d60]">
                  Karim adalah siswa di SMKN 2 Cilaku. Percakapan dan perkembangan hubungan tetap ditentukan oleh obrolan kalian, bukan oleh menu ini.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-[#b39a82]">
            <Calendar size={13} />
            <span>Info sekolah · tidak mengubah cerita</span>
          </div>
        </div>
      </div>
    </div>
  );
};
