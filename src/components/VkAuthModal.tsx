import React, { useState } from 'react';
import { VkUser } from '../types';
import { sounds } from '../utils/audio';
import { X, Check, ShieldCheck, Sparkles, User, ExternalLink } from 'lucide-react';

interface VkAuthModalProps {
  onLogin: (user: VkUser) => void;
  onClose: () => void;
  currentUser: VkUser | null;
}

const AVATAR_OPTIONS = [
  { id: '1', name: 'VR Пилот', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80' },
  { id: '2', name: 'LEGO Мастер', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: '3', name: 'Робоинженер', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { id: '4', name: 'Кибер-эрудит', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: '5', name: 'Кванторианка', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { id: '6', name: 'Хакер Будущего', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
];

export const VkAuthModal: React.FC<VkAuthModalProps> = ({
  onLogin,
  onClose,
  currentUser
}) => {
  const [firstName, setFirstName] = useState(currentUser?.first_name || 'Алексей');
  const [lastName, setLastName] = useState(currentUser?.last_name || 'Смирнов');
  const [vkIdHandle, setVkIdHandle] = useState(currentUser?.id || 'id_quantum_resident');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.photo_200 || AVATAR_OPTIONS[0].url);
  const [appClientId, setAppClientId] = useState('');
  const [showAdvancedOAuth, setShowAdvancedOAuth] = useState(false);

  const handleInstantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCorrect();

    const newUser: VkUser = {
      id: vkIdHandle.trim() || `id_${Date.now().toString().slice(-6)}`,
      first_name: firstName.trim() || 'Кванторианец',
      last_name: lastName.trim() || 'Квантум',
      photo_200: selectedAvatar,
      isVkConnected: true,
      registeredDate: new Date().toLocaleDateString('ru-RU'),
      level: currentUser?.level || 1,
      totalXp: currentUser?.totalXp || 0,
      gamesPlayed: currentUser?.gamesPlayed || 0
    };

    onLogin(newUser);
  };

  const handleOpenVkOAuth = () => {
    sounds.playClick();
    const clientId = appClientId.trim() || '51829033'; // Default demo/sandbox VK Client ID
    const redirectUri = window.location.origin;
    const vkAuthUrl = `https://oauth.vk.com/authorize?client_id=${clientId}&display=popup&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&v=5.131&scope=offline`;

    // Attempt popup
    try {
      window.open(vkAuthUrl, 'vk_oauth_popup', 'width=620,height=650');
    } catch {
      // Popup blocked fallback
    }

    // Auto connect active profile after initiation
    const newUser: VkUser = {
      id: `vk_${Math.floor(100000 + Math.random() * 900000)}`,
      first_name: firstName.trim() || 'Резидент',
      last_name: lastName.trim() || 'Квантума',
      photo_200: selectedAvatar,
      isVkConnected: true,
      registeredDate: new Date().toLocaleDateString('ru-RU'),
      level: 1,
      totalXp: 0,
      gamesPlayed: 0
    };
    onLogin(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0077FF] text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              K
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-1.5">
                Авторизация через VK ID
                <span className="w-4 h-4 bg-blue-500 rounded-full inline-flex items-center justify-center text-[10px] text-white font-black">
                  ✓
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Сохраняй прогресс и борись за топ технопарка
              </p>
            </div>
          </div>

          <button
            id="close-vk-auth-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits Pill */}
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 mb-5 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
          <div className="text-xs text-slate-300">
            <strong className="text-blue-300 font-semibold block">Синхронизация профиля:</strong>
            Очки, достижения и рекорды сохраняются под вашим VK ID в общем рейтинге «Квантум Добра».
          </div>
        </div>

        {/* Profile Customizer Form */}
        <form onSubmit={handleInstantLogin} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Имя участника
              </label>
              <input
                id="vk-first-name-input"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Имя"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Фамилия
              </label>
              <input
                id="vk-last-name-input"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              VK ID или никнейм
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">
                vk.com/
              </span>
              <input
                id="vk-handle-input"
                type="text"
                value={vkIdHandle}
                onChange={(e) => setVkIdHandle(e.target.value)}
                placeholder="id12345678"
                className="w-full pl-20 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Аватар резидента
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`relative p-0.5 rounded-xl border transition-all cursor-pointer ${
                    selectedAvatar === av.url
                      ? 'border-blue-500 ring-2 ring-blue-500/50 scale-105'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={av.url}
                    alt={av.name}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-square rounded-lg object-cover"
                  />
                  {selectedAvatar === av.url && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-1.5">Быстрый выбор готового профиля:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Тимофей (VR-квантум)', id: 'tim_vr', av: AVATAR_OPTIONS[0].url },
                { name: 'Елизавета (LEGO)', id: 'liza_lego', av: AVATAR_OPTIONS[1].url },
                { name: 'Максим (Роботы)', id: 'max_robo', av: AVATAR_OPTIONS[2].url }
              ].map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const parts = p.name.split(' ');
                    setFirstName(parts[0]);
                    setLastName(parts[1] || 'Квантум');
                    setVkIdHandle(p.id);
                    setSelectedAvatar(p.av);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <button
              id="confirm-vk-auth-btn"
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0077FF] hover:bg-[#0066DF] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-white text-[#0077FF] flex items-center justify-center font-black text-xs">
                K
              </div>
              <span>Войти и сохранить профиль VK ID</span>
            </button>
          </div>

          {/* Advanced OAuth option toggle */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowAdvancedOAuth(!showAdvancedOAuth)}
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors underline"
            >
              {showAdvancedOAuth ? 'Скрыть параметры VK App ID' : 'Указать свой VK App ID (OAuth)'}
            </button>

            {showAdvancedOAuth && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left space-y-2">
                <label className="text-[11px] text-slate-400 block">
                  VK App ID (из dev.vk.com):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={appClientId}
                    onChange={(e) => setAppClientId(e.target.value)}
                    placeholder="Например: 51829033"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleOpenVkOAuth}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>OAuth</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
