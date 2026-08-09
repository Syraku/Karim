import React from 'react';
import { X, Heart, Shield, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { RelationshipState } from '../types';
import { RELATIONSHIP_STAGES } from '../data/karimData';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: RelationshipState;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({ isOpen, onClose, relationship }) => {
  if (!isOpen) return null;
  const currentStage = RELATIONSHIP_STAGES.find((s) => s.id === relationship.stage) || RELATIONSHIP_STAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#4c4145]/35">
      <div className="bg-[#fffaf0] w-full max-w-lg rounded-[26px] shadow-xl border-2 border-[#ead7b6] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="relative bg-[#fff1d5] p-4 border-b-2 border-[#ead7b6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#bb687c]" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#a1846c] font-extrabold block">Progress Kedekatan</span>
              <h2 className="text-base font-extrabold text-[#4b3b42]">{currentStage.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#806d60] hover:bg-[#f7e8ca] rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-[#5b4c4a]">
          <div className="bg-[#fff5df] p-4 rounded-2xl border-2 border-[#ead7b6] space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a1846c] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#8d7288]" /> Indikator Kedekatan
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#8d7288]">Kedekatan</span><span>{relationship.closeness}%</span></div>
              <div className="h-2.5 bg-[#ead7b6] rounded-full overflow-hidden"><div className="h-full bg-[#8d7288] transition-all duration-500 rounded-full" style={{ width: `${Math.min(relationship.closeness, 100)}%` }} /></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#bb687c]">Perhatian</span><span>{relationship.affection}%</span></div>
              <div className="h-2.5 bg-[#ead7b6] rounded-full overflow-hidden"><div className="h-full bg-[#bb687c] transition-all duration-500 rounded-full" style={{ width: `${Math.min(relationship.affection, 100)}%` }} /></div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#6f824f] flex items-center gap-1"><Shield className="w-3 h-3" /> Kepercayaan</span><span>{relationship.trust}%</span></div>
              <div className="h-2.5 bg-[#ead7b6] rounded-full overflow-hidden"><div className="h-full bg-[#91a56b] transition-all duration-500 rounded-full" style={{ width: `${Math.min(relationship.trust, 100)}%` }} /></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#a1846c] flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#bb687c]" /> Tahapan Kedekatan
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {RELATIONSHIP_STAGES.map((st) => {
                const isCurrent = st.id === relationship.stage;
                const isPassed = st.id < relationship.stage;
                return (
                  <div key={st.id} className={`p-3 rounded-2xl border-2 text-xs transition-all flex items-start gap-3 ${isCurrent ? 'bg-[#fae1e3] border-[#e8bfc7]' : isPassed ? 'bg-[#fff5df] border-[#ead7b6]' : 'bg-[#fffaf0] border-[#ead7b6] opacity-45'}`}>
                    <div className="mt-0.5">
                      {isPassed || isCurrent ? <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#bb687c]' : 'text-[#a1846c]'}`} /> : <div className="w-4 h-4 rounded-full border-2 border-[#dfc79f]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#4b3b42]">{st.id}. {st.name}</span>
                        {isCurrent && <span className="text-[10px] bg-[#bb687c] text-white font-bold px-2 py-0.5 rounded-full">Aktif</span>}
                      </div>
                      <p className="text-[#6e5c59] mt-0.5 leading-relaxed">{st.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
