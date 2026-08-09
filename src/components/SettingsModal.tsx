import React, { useState } from 'react';
import { X, RotateCcw, Volume2, VolumeX, User, Bell, Check, AlertTriangle } from 'lucide-react';
import { PlayerProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerProfile: PlayerProfile;
  onUpdateProfile: (profile: PlayerProfile) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  autoInitiateEnabled: boolean;
  onToggleAutoInitiate: () => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  playerProfile,
  onUpdateProfile,
  audioEnabled,
  onToggleAudio,
  autoInitiateEnabled,
  onToggleAutoInitiate,
  onResetGame,
}) => {
  const [nameInput, setNameInput] = useState(playerProfile.name);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    if (!nameInput.trim()) return;
    onUpdateProfile({
      ...playerProfile,
      name: nameInput.trim(),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-slate-100 dark:bg-zinc-800 p-4 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between text-slate-900 dark:text-zinc-100">
          <h2 className="font-bold text-base">
            Pengaturan Game
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-slate-800 dark:text-slate-200 text-sm">
          {/* Player Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-500" />
              Nama Pemain
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Masukkan namamu..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition-all"
              >
                {savedMessage ? <Check className="w-4 h-4" /> : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Audio FX Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              {audioEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <span className="font-semibold block text-sm">Suara & Efek FX</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Efek suara saat pesan masuk dan level naik
                </span>
              </div>
            </div>
            <button
              onClick={onToggleAudio}
              className={`w-12 h-6 rounded-full transition-colors p-1 relative ${
                audioEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  audioEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Karim Ping Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-500" />
              <div>
                <span className="font-semibold block text-sm">Inisiatif Chat Karim</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Karim dapat mengirim pesan duluan secara berkala
                </span>
              </div>
            </div>
            <button
              onClick={onToggleAutoInitiate}
              className={`w-12 h-6 rounded-full transition-colors p-1 relative ${
                autoInitiateEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoInitiateEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Danger Zone / Reset */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-4 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Mulai Ulang Cerita Dari Awal (Reset Save)
              </button>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Konfirmasi Reset Progress
                </div>
                <p className="text-rose-700 dark:text-rose-300">
                  Semua riwayat chat, memori tersimpan, dan level hubungan dengan Karim akan dihapus. Yakin mau mulai dari awal?
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      onResetGame();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-all"
                  >
                    Ya, Reset Sekarang
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="py-1.5 px-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
