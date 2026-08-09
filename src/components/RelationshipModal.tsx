import React from 'react';
import { X, Heart, Shield, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { RelationshipState } from '../types';
import { RELATIONSHIP_STAGES } from '../data/karimData';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  relationship: RelationshipState;
}

export const RelationshipModal: React.FC<RelationshipModalProps> = ({
  isOpen,
  onClose,
  relationship,
}) => {
  if (!isOpen) return null;

  const currentStage = RELATIONSHIP_STAGES.find((s) => s.id === relationship.stage) || RELATIONSHIP_STAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-slate-100 dark:bg-zinc-800 p-4 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between text-slate-900 dark:text-zinc-100">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold block">
                Progress Hubungan
              </span>
              <h2 className="text-base font-bold">{currentStage.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200">
          {/* Internal Metrics Progress Bars */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Indikator Kedekatan Emosional
            </h3>

            {/* Closeness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  Kedekatan (Closeness)
                </span>
                <span>{relationship.closeness}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(relationship.closeness, 100)}%` }}
                />
              </div>
            </div>

            {/* Affection */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  Perhatian (Affection)
                </span>
                <span>{relationship.affection}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(relationship.affection, 100)}%` }}
                />
              </div>
            </div>

            {/* Trust */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Kepercayaan (Trust)
                </span>
                <span>{relationship.trust}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(relationship.trust, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Relationship Stages Roadmap */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-rose-500" />
              Tahapan Perjalanan Cinta (9 Stage)
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {RELATIONSHIP_STAGES.map((st) => {
                const isCurrent = st.id === relationship.stage;
                const isPassed = st.id < relationship.stage;

                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 ring-2 ring-rose-400/30'
                        : isPassed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                        : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed || isCurrent ? (
                        <CheckCircle2
                          className={`w-4 h-4 ${isCurrent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {st.id}. {st.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {st.description}
                      </p>
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
