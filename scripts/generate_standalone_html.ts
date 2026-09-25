import fs from 'fs';
import path from 'path';
import { VR_QUESTIONS } from '../src/data/questions/vr';
import { ROBOTICS_QUESTIONS } from '../src/data/questions/robotics';
import { LEGO_QUESTIONS } from '../src/data/questions/lego';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { INITIAL_LEADERBOARD } from '../src/data/initialLeaderboard';
import { AGE_TIERS } from '../src/data/questions';

const allQuestions = [...VR_QUESTIONS, ...ROBOTICS_QUESTIONS, ...LEGO_QUESTIONS];

const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Викторина «Квантум Добра» — VR, Робототехника и LEGO</title>
  <meta name="description" content="Интерактивная адаптивная оффлайн-викторина технопарка «Квантум Добра»">
  <style>
    /* CSS Reset & Base */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      line-height: 1.5;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, transparent 60%),
                        radial-gradient(circle at 10% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 90% 90%, rgba(217, 70, 239, 0.06) 0%, transparent 50%);
      background-attachment: fixed;
    }
    button, input { font-family: inherit; }
    button { cursor: pointer; border: none; outline: none; transition: all 0.2s ease; }
    button:active { transform: scale(0.98); }
    .container { max-width: 1040px; margin: 0 auto; padding: 16px; }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); }
    ::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.8); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.8); }

    /* Header */
    header {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(51, 65, 85, 0.4);
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      max-width: 1040px;
      margin: 0 auto;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand-icon {
      width: 42px; height: 42px; border-radius: 12px;
      background: linear-gradient(135deg, #06b6d4, #3b82f6, #6366f1);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
    }
    .brand-title { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
    .brand-sub { font-size: 11px; color: #38bdf8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .btn-action {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      color: #cbd5e1;
      padding: 7px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-action:hover {
      background: rgba(51, 65, 85, 0.8);
      color: #fff;
      border-color: #06b6d4;
    }
    .btn-vk {
      background: #2787f5;
      color: #fff;
      border: 1px solid #4599ff;
      padding: 7px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(39, 135, 245, 0.3);
    }
    .btn-vk:hover { background: #1a75e0; }

    /* Offline badge in header */
    .badge-offline {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Cards & Panels */
    .card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.5);
      border-radius: 18px;
      padding: 20px;
      margin-bottom: 20px;
      backdrop-filter: blur(8px);
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Age Tiers */
    .age-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
    .age-card {
      background: rgba(15, 23, 42, 0.7);
      border: 2px solid rgba(51, 65, 85, 0.5);
      border-radius: 16px;
      padding: 16px;
      text-align: left;
      position: relative;
      overflow: hidden;
    }
    .age-card.active {
      border-color: #06b6d4;
      background: rgba(8, 51, 68, 0.35);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
    }
    .age-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .age-kids { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .age-juniors { background: rgba(6, 182, 212, 0.2); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.3); }
    .age-seniors { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); }
    .age-meta { display: flex; gap: 12px; font-size: 11px; color: #94a3b8; margin-top: 10px; }

    /* Categories Grid */
    .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .cat-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 16px;
      padding: 16px;
      text-align: left;
      transition: all 0.2s;
    }
    .cat-card:hover { border-color: #64748b; background: rgba(30, 41, 59, 0.5); }
    .cat-card.active {
      border-color: #06b6d4;
      background: rgba(8, 47, 73, 0.4);
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
    }
    .cat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .cat-icon { font-size: 26px; }
    .cat-count { font-size: 11px; background: rgba(30, 41, 59, 0.9); padding: 2px 8px; border-radius: 9999px; color: #cbd5e1; border: 1px solid #475569; }
    .cat-title { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .cat-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }

    /* Start Bar */
    .start-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 16px;
    }
    .round-picker { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1; }
    .round-btn {
      padding: 6px 12px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid #475569;
      color: #94a3b8;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
    }
    .round-btn.active {
      background: #06b6d4;
      color: #020617;
      border-color: #06b6d4;
    }
    .btn-start {
      background: linear-gradient(135deg, #06b6d4, #2563eb, #7c3aed);
      color: #fff;
      font-size: 16px;
      font-weight: 800;
      padding: 12px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 18px rgba(6, 182, 212, 0.35);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .btn-start:hover {
      box-shadow: 0 6px 24px rgba(6, 182, 212, 0.5);
      filter: brightness(1.08);
    }

    /* Quiz Screen */
    .quiz-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }
    .timer-container {
      margin-bottom: 16px;
    }
    .timer-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .timer-bar-bg {
      height: 8px;
      background: rgba(30, 41, 59, 0.8);
      border-radius: 9999px;
      overflow: hidden;
      border: 1px solid rgba(51, 65, 85, 0.5);
    }
    .timer-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #06b6d4, #10b981);
      width: 100%;
      border-radius: 9999px;
      transition: width 0.3s linear, background-color 0.3s;
    }
    .timer-warning .timer-bar-fill {
      background: linear-gradient(90deg, #f59e0b, #ef4444);
    }

    .question-box {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 18px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }
    .question-hint {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .question-text {
      font-size: 19px;
      font-weight: 700;
      color: #fff;
      line-height: 1.4;
    }

    /* Options Grid */
    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      margin-bottom: 18px;
    }
    @media (min-width: 640px) {
      .options-grid { grid-template-columns: 1fr 1fr; }
    }
    .option-btn {
      background: rgba(30, 41, 59, 0.7);
      border: 1.5px solid rgba(51, 65, 85, 0.7);
      border-radius: 14px;
      padding: 14px 18px;
      color: #e2e8f0;
      font-size: 15px;
      font-weight: 600;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 12px;
      line-height: 1.35;
    }
    .option-btn:hover:not(:disabled) {
      background: rgba(51, 65, 85, 0.7);
      border-color: #06b6d4;
      color: #fff;
    }
    .option-index {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      flex-shrink: 0;
    }
    .option-btn.correct {
      background: rgba(16, 185, 129, 0.25) !important;
      border-color: #10b981 !important;
      color: #34d399 !important;
    }
    .option-btn.correct .option-index {
      background: #10b981;
      color: #020617;
      border-color: #10b981;
    }
    .option-btn.wrong {
      background: rgba(239, 68, 68, 0.25) !important;
      border-color: #ef4444 !important;
      color: #f87171 !important;
    }
    .option-btn.wrong .option-index {
      background: #ef4444;
      color: #fff;
      border-color: #ef4444;
    }

    /* Explanation Box */
    .explanation-box {
      background: rgba(8, 47, 73, 0.4);
      border: 1px solid rgba(6, 182, 212, 0.4);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 16px;
      animation: fadeIn 0.3s ease;
    }
    .exp-title { font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 4px; }
    .exp-text { font-size: 14px; color: #cbd5e1; margin-bottom: 10px; }
    .fact-box {
      background: rgba(15, 23, 42, 0.8);
      border-left: 3px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      color: #e2e8f0;
    }
    .fact-title { font-weight: 700; color: #fbbf24; margin-bottom: 2px; }

    .btn-next {
      background: linear-gradient(135deg, #06b6d4, #2563eb);
      color: #fff;
      font-size: 15px;
      font-weight: 800;
      padding: 12px 24px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      float: right;
    }

    /* Results */
    .results-card {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(51, 65, 85, 0.7);
      border-radius: 24px;
      padding: 32px 24px;
      text-align: center;
      max-width: 680px;
      margin: 0 auto;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    }
    .results-badge { font-size: 48px; margin-bottom: 8px; }
    .results-title { font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 6px; }
    .results-subtitle { font-size: 14px; color: #94a3b8; margin-bottom: 24px; }
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-pill {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 14px;
      padding: 12px;
    }
    .stat-val { font-size: 22px; font-weight: 900; color: #38bdf8; }
    .stat-lbl { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }

    /* Modals */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }
    .modal-overlay.open { display: flex; animation: fadeIn 0.2s ease; }
    .modal-content {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 20px;
      max-width: 580px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: #1e293b;
      border: 1px solid #475569;
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
    }
    .modal-close:hover { color: #fff; background: #334155; }

    /* Leaderboard Podium */
    .podium-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 16px 0; }
    .podium-slot {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 12px;
      padding: 10px 8px;
      text-align: center;
    }
    .podium-slot.first { border-color: #eab308; background: rgba(234, 179, 8, 0.1); }
    .podium-slot.second { border-color: #94a3b8; }
    .podium-slot.third { border-color: #d97706; }
    .podium-avatar { width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 6px; object-fit: cover; }
    .podium-name { font-size: 11px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
    .podium-score { font-size: 13px; font-weight: 800; color: #38bdf8; }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #0f172a, #1e1b4b);
      border: 1px solid #6366f1;
      border-radius: 14px;
      padding: 14px 18px;
      color: #fff;
      display: none;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
      z-index: 200;
      animation: slideUp 0.3s ease;
    }
    .toast.show { display: flex; }

    /* Confetti Canvas */
    #confetti-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 150;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <!-- Confetti Canvas -->
  <canvas id="confetti-canvas"></canvas>

  <!-- Header -->
  <header>
    <div class="header-inner">
      <div class="brand">
        <div class="brand-icon">⚡</div>
        <div>
          <div class="brand-title">Квантум Добра</div>
          <div class="brand-sub">Инженерная викторина</div>
        </div>
        <span class="badge-offline">● Оффлайн-версия</span>
      </div>

      <div class="header-actions">
        <button id="btn-sound-toggle" class="btn-action" title="Включить/выключить звук">
          <span id="sound-icon">🔊</span>
          <span id="sound-label">Звук</span>
        </button>
        <button id="btn-open-leaderboard" class="btn-action">
          🏆 Лидеры
        </button>
        <button id="btn-open-achievements" class="btn-action">
          ⭐ Награды (<span id="unlocked-count">0</span>/9)
        </button>
        <button id="btn-open-vk" class="btn-vk">
          <span id="header-user-avatar">💙</span>
          <span id="header-user-name">VK ID</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <div class="container">

    <!-- SCREEN 1: MENU -->
    <div id="screen-menu">
      <!-- Welcome Banner -->
      <div class="card" style="background: linear-gradient(135deg, rgba(8, 47, 73, 0.4), rgba(15, 23, 42, 0.7)); border-color: rgba(6, 182, 212, 0.4);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 4px;">
              Приветствуем в детском технопарке «Квантум Добра»! 🚀
            </div>
            <div style="font-size: 13px; color: #94a3b8; max-width: 680px;">
              Интерактивная викторина по VR-технологиям, робототехнике и легоконструированию. Выбери свой возраст и направление, чтобы начать соревнование!
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="font-size: 11px; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); color: #38bdf8; padding: 4px 10px; border-radius: 9999px; font-weight: 700;">
              96 вопросов в базе
            </span>
          </div>
        </div>
      </div>

      <!-- 1. Age Tier Selector -->
      <div class="card">
        <div class="card-title">
          <span>Шаг 1: Возрастная категория (сложность адаптируется)</span>
          <span style="font-size: 11px; color: #38bdf8; font-weight: 600;">3 уровня сложности</span>
        </div>
        <div class="age-grid">
          <div class="age-card active" data-age="kids" onclick="setAgeGroup('kids')">
            <span class="age-badge age-kids">6–9 лет</span>
            <div style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 2px;">🚀 Младшие изобретатели</div>
            <div style="font-size: 12px; color: #94a3b8;">Наглядные вопросы с подсказками, датчики вокруг нас и основы LEGO WeDo.</div>
            <div class="age-meta">
              <span>⏱️ 35 сек / вопрос</span>
              <span>⭐ Множитель x1.0</span>
            </div>
          </div>

          <div class="age-card" data-age="juniors" onclick="setAgeGroup('juniors')">
            <span class="age-badge age-juniors">10–13 лет</span>
            <div style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 2px;">⚡ Юные инженеры</div>
            <div style="font-size: 12px; color: #94a3b8;">Редукторы, датчики цвета и звука, контроллеры и свобода движений 3DoF/6DoF.</div>
            <div class="age-meta">
              <span>⏱️ 25 сек / вопрос</span>
              <span>⭐ Множитель x1.5</span>
            </div>
          </div>

          <div class="age-card" data-age="seniors" onclick="setAgeGroup('seniors')">
            <span class="age-badge age-seniors">14+ лет</span>
            <div style="font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 2px;">🧠 Продвинутые резиденты</div>
            <div style="font-size: 12px; color: #94a3b8;">Инверсная кинематика, SLAM-картография, оптический трекинг и ROS 2.</div>
            <div class="age-meta">
              <span>⏱️ 20 сек / вопрос</span>
              <span>⭐ Множитель x2.0</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Category Selector -->
      <div class="card">
        <div class="card-title">
          <span>Шаг 2: Выбор квантума (направления)</span>
          <span id="topic-questions-count" style="font-size: 11px; color: #38bdf8; font-weight: 600;">32 вопроса в теме</span>
        </div>
        <div class="cat-grid">
          <div class="cat-card active" data-cat="vr" onclick="setCategory('vr')">
            <div class="cat-top">
              <span class="cat-icon">🥽</span>
              <span class="cat-count">32 вопроса</span>
            </div>
            <div class="cat-title">VR-технологии</div>
            <div class="cat-desc">Виртуальная и дополненная реальность, шлемы, линзы и трекинг.</div>
          </div>

          <div class="cat-card" data-cat="robotics" onclick="setCategory('robotics')">
            <div class="cat-top">
              <span class="cat-icon">🤖</span>
              <span class="cat-count">32 вопроса</span>
            </div>
            <div class="cat-title">Робототехника</div>
            <div class="cat-desc">Промробоквантум, датчики, сервоприводы, ПИД-регуляторы и моторы.</div>
          </div>

          <div class="cat-card" data-cat="lego" onclick="setCategory('lego')">
            <div class="cat-top">
              <span class="cat-icon">🧱</span>
              <span class="cat-count">43 вопроса</span>
            </div>
            <div class="cat-title">Легоконструирование</div>
            <div class="cat-desc">Механика, редукторы, роботы LEGO Mindstorms EV3, SPIKE & WeDo.</div>
          </div>

          <div class="cat-card" data-cat="all" onclick="setCategory('all')">
            <div class="cat-top">
              <span class="cat-icon">⚡</span>
              <span class="cat-count">107 вопросов</span>
            </div>
            <div class="cat-title">Квантум Микс</div>
            <div class="cat-desc">Комплексный турнир по всем темам сразу. Максимум опыта и наград!</div>
          </div>
        </div>

        <!-- Participant Info Form for Certificate -->
        <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 16px; padding: 16px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 18px;">🎖️</span>
            <div style="font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px;">
              Данные участника для именного сертификата
            </div>
            <span style="font-size: 10px; padding: 2px 8px; border-radius: 9999px; background: rgba(234, 179, 8, 0.15); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.3); font-weight: 700; margin-left: auto;">
              Выдаётся по завершении
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                Имя и Отчество <span style="color: #f43f5e;">*</span>
              </label>
              <input type="text" id="participant-name-input" style="width: 100%; background: #020617; border: 1px solid #334155; border-radius: 10px; padding: 9px 12px; color: #fff; font-size: 13px; outline: none;" placeholder="Например: Алексей Сергеевич" onchange="saveParticipantData()">
            </div>
            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">
                Школа / Класс / Организация
              </label>
              <input type="text" id="participant-school-input" style="width: 100%; background: #020617; border: 1px solid #334155; border-radius: 10px; padding: 9px 12px; color: #fff; font-size: 13px; outline: none;" placeholder="Например: МБОУ СОШ №10, 7А класс" onchange="saveParticipantData()">
            </div>
          </div>
        </div>

        <!-- Start & Round length Bar -->
        <div class="start-bar">
          <div class="round-picker">
            <span>Длина раунда:</span>
            <button class="round-btn active" data-len="8" onclick="setRoundLength(8)">8 вопросов</button>
            <button class="round-btn" data-len="12" onclick="setRoundLength(12)">12 вопросов</button>
            <button class="round-btn" data-len="0" onclick="setRoundLength(0)">Все вопросы</button>
          </div>

          <button id="btn-start-game" class="btn-start" onclick="startQuiz()">
            <span>Начать викторину</span>
            <span style="font-size: 18px;">➔</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SCREEN 2: ACTIVE QUIZ -->
    <div id="screen-quiz" style="display: none;">
      <div class="quiz-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="btn-action" onclick="confirmQuit()" style="padding: 6px 10px;">✕ В меню</button>
          <span id="quiz-cat-badge" style="font-size: 11px; font-weight: 700; background: rgba(6, 182, 212, 0.2); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.3); padding: 4px 10px; border-radius: 9999px;">
            🥽 VR-технологии
          </span>
          <span id="quiz-age-badge" style="font-size: 11px; font-weight: 700; background: rgba(99, 102, 241, 0.2); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 10px; border-radius: 9999px;">
            6–9 лет
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div id="streak-indicator" style="display: none; align-items: center; gap: 4px; font-size: 13px; font-weight: 800; color: #fbbf24; background: rgba(245, 158, 11, 0.15); padding: 3px 10px; border-radius: 9999px; border: 1px solid rgba(245, 158, 11, 0.3);">
            🔥 Стрик x<span id="streak-count">0</span>
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #38bdf8;">
            Счет: <span id="quiz-score">0</span>
          </div>
        </div>
      </div>

      <!-- Timer Bar -->
      <div class="timer-container" id="timer-box">
        <div class="timer-info">
          <span>Вопрос <span id="current-q-num">1</span> из <span id="total-q-num">8</span></span>
          <span>⏱️ <span id="timer-seconds">35</span> сек</span>
        </div>
        <div class="timer-bar-bg">
          <div class="timer-bar-fill" id="timer-fill"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="question-box">
        <div id="q-img-wrap" style="display: none; width: 100%; height: 210px; max-height: 250px; border-radius: 14px; overflow: hidden; margin-bottom: 14px; position: relative; border: 1px solid rgba(51, 65, 85, 0.6); background: rgba(2, 6, 23, 0.8);">
          <img id="q-img" src="" alt="Иллюстрация к вопросу" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none'">
          <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 10px; font-size: 16px; border: 1px solid rgba(51, 65, 85, 0.6); display: flex; align-items: center; gap: 6px;">
            <span id="q-img-badge">🥽</span>
            <span style="font-size: 11px; color: #cbd5e1; font-weight: 600;">К вопросу</span>
          </div>
        </div>
        <div class="question-hint" id="q-hint">🥽</div>
        <div class="question-text" id="q-text">Загрузка вопроса...</div>
      </div>

      <!-- Options -->
      <div class="options-grid" id="options-container">
        <!-- 4 option buttons will be rendered here -->
      </div>

      <!-- Explanation Box -->
      <div class="explanation-box" id="explanation-container" style="display: none;">
        <div class="exp-title" id="exp-status">Правильно! 🎉</div>
        <div class="exp-text" id="exp-text">Объяснение ответа...</div>
        <div class="fact-box" id="fact-box">
          <div class="fact-title">💡 Факт технопарка:</div>
          <div id="fact-text">Интересный факт...</div>
        </div>
        <div style="overflow: hidden; margin-top: 14px;">
          <button class="btn-next" id="btn-next-question" onclick="nextQuestion()">
            <span>Следующий вопрос</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SCREEN 3: RESULTS -->
    <div id="screen-results" style="display: none;">
      <div class="results-card">
        <div class="results-badge" id="res-badge">🏆</div>
        <h2 class="results-title" id="res-title">Викторина пройдена!</h2>
        <p class="results-subtitle" id="res-subtitle">Отличный результат, резидент технопарка!</p>

        <div class="stats-row">
          <div class="stat-pill">
            <div class="stat-val" id="res-score">0</div>
            <div class="stat-lbl">Очки XP</div>
          </div>
          <div class="stat-pill">
            <div class="stat-val" id="res-accuracy">0%</div>
            <div class="stat-lbl">Точность</div>
          </div>
          <div class="stat-pill">
            <div class="stat-val" id="res-correct">0/0</div>
            <div class="stat-lbl">Верно</div>
          </div>
          <div class="stat-pill">
            <div class="stat-val" id="res-maxstreak">0</div>
            <div class="stat-lbl">Макс. Стрик</div>
          </div>
        </div>

        <!-- Get Certificate Banner -->
        <div style="background: linear-gradient(135deg, rgba(120, 53, 15, 0.4), rgba(15, 23, 42, 0.8), rgba(8, 47, 73, 0.4)); border: 1px solid rgba(234, 179, 8, 0.4); border-radius: 18px; padding: 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(234, 179, 8, 0.2); border: 1px solid rgba(234, 179, 8, 0.4); display: flex; align-items: center; justify-content: center; font-size: 22px; shrink: 0;">
              🎖️
            </div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 2px;">
                Ваш персональный сертификат готов!
              </div>
              <div style="font-size: 12px; color: #cbd5e1;">
                Заберите именной диплом «Квантум Добра» с вашим результатом и школой.
              </div>
            </div>
          </div>
          <button onclick="openCertificateModal()" class="btn-start" style="padding: 10px 20px; font-size: 13px; background: linear-gradient(135deg, #eab308, #f59e0b); color: #020617; font-weight: 800;">
            🎖️ Получить сертификат
          </button>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-start" onclick="restartQuiz()">
            <span>Сыграть ещё раз</span>
            <span>↺</span>
          </button>
          <button class="btn-action" style="font-size: 14px; padding: 10px 20px;" onclick="openLeaderboard()">
            🏆 Таблица лидеров
          </button>
          <button class="btn-action" style="font-size: 14px; padding: 10px 20px;" onclick="showMenu()">
            📋 Выбор темы
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- MODAL: CERTIFICATE -->
  <div class="modal-overlay" id="modal-certificate" onclick="closeModalOnOverlay(event, 'modal-certificate')">
    <div class="modal-content" style="max-width: 860px; text-align: left;">
      <button class="modal-close" onclick="closeModal('modal-certificate')">✕</button>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; gap: 10px; border-bottom: 1px solid #334155; padding-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">🎖️</span>
          <div>
            <h3 style="font-size: 18px; font-weight: 800; color: #fff;">Именной электронный сертификат</h3>
            <p style="font-size: 12px; color: #94a3b8;">Детский технопарк «Квантум Добра» · Высокое разрешение (1920×1080)</p>
          </div>
        </div>
      </div>

      <!-- Editable Name & School -->
      <div style="background: rgba(2, 6, 23, 0.8); border: 1px solid #334155; border-radius: 12px; padding: 12px; margin-bottom: 14px;">
        <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">
          Уточнение данных участников перед скачиванием:
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
          <div>
            <label style="font-size: 11px; color: #cbd5e1; display: block; margin-bottom: 3px;">Имя и Отчество:</label>
            <input type="text" id="cert-modal-name" style="width: 100%; background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 6px 10px; color: #fff; font-size: 13px;" oninput="updateCertPreview()">
          </div>
          <div>
            <label style="font-size: 11px; color: #cbd5e1; display: block; margin-bottom: 3px;">Школа / Класс / Организация:</label>
            <input type="text" id="cert-modal-school" style="width: 100%; background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 6px 10px; color: #fff; font-size: 13px;" oninput="updateCertPreview()">
          </div>
        </div>
      </div>

      <!-- Certificate Canvas Image Container -->
      <div style="position: relative; border-radius: 14px; overflow: hidden; border: 1px solid rgba(6, 182, 212, 0.4); background: #020617; text-align: center; margin-bottom: 14px;">
        <img id="cert-img-preview" src="" style="width: 100%; height: auto; max-height: 480px; object-fit: contain; display: block; margin: 0 auto;" alt="Сертификат">
      </div>

      <!-- Footer Buttons -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-top: 1px solid #334155; padding-top: 12px;">
        <div style="font-size: 11px; color: #94a3b8;">
          ID: <code id="cert-modal-id" style="color: #38bdf8; font-weight: 700;">QD-2026-0000</code>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-action" style="font-size: 13px; padding: 8px 16px;" onclick="printCertFromModal()">
            🖨️ Печать / PDF
          </button>
          <button class="btn-start" style="font-size: 13px; padding: 8px 20px; background: linear-gradient(135deg, #10b981, #06b6d4);" onclick="downloadCertFromModal()">
            💾 Скачать сертификат (PNG)
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL: LEADERBOARD -->
  <div class="modal-overlay" id="modal-leaderboard" onclick="closeModalOnOverlay(event, 'modal-leaderboard')">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal('modal-leaderboard')">✕</button>
      <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 4px;">Таблица лидеров технопарка</h3>
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Лучшие результаты резидентов «Квантум Добра»</p>

      <!-- Podium -->
      <div class="podium-grid" id="leaderboard-podium">
        <!-- Rendered via JS -->
      </div>

      <!-- List -->
      <div id="leaderboard-list" style="margin-top: 16px;">
        <!-- List rows -->
      </div>
    </div>
  </div>

  <!-- MODAL: ACHIEVEMENTS -->
  <div class="modal-overlay" id="modal-achievements" onclick="closeModalOnOverlay(event, 'modal-achievements')">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal('modal-achievements')">✕</button>
      <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 4px;">Достижения резидента</h3>
      <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">Разблокируй все 9 уникальных значков технопарка!</p>

      <div id="achievements-list" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
        <!-- Rendered via JS -->
      </div>
    </div>
  </div>

  <!-- MODAL: VK AUTH -->
  <div class="modal-overlay" id="modal-vk" onclick="closeModalOnOverlay(event, 'modal-vk')">
    <div class="modal-content" style="max-width: 440px;">
      <button class="modal-close" onclick="closeModal('modal-vk')">✕</button>
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
        <div style="width: 38px; height: 38px; border-radius: 10px; background: #2787f5; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px;">💙</div>
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #fff;">Профиль резидента</h3>
          <p style="font-size: 12px; color: #94a3b8;">Сохранение очков и участие в рейтинге</p>
        </div>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">Имя участника:</label>
        <input type="text" id="input-username" style="width: 100%; background: #1e293b; border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px;" placeholder="Например: Иван Иванов" value="Юный Кванторианец">
      </div>

      <div style="margin-bottom: 14px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">Никнейм VK ID:</label>
        <input type="text" id="input-vkid" style="width: 100%; background: #1e293b; border: 1px solid #475569; border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px;" placeholder="id12345678 или логин" value="quantum_resident">
      </div>

      <div style="margin-bottom: 18px;">
        <label style="display: block; font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 6px;">Выбери аватар:</label>
        <div style="display: flex; gap: 10px; font-size: 24px;">
          <button class="avatar-pick-btn" onclick="pickAvatar('🤖')" style="padding: 8px; border-radius: 10px; background: #1e293b; border: 2px solid #06b6d4;">🤖</button>
          <button class="avatar-pick-btn" onclick="pickAvatar('🥽')" style="padding: 8px; border-radius: 10px; background: #1e293b; border: 2px solid transparent;">🥽</button>
          <button class="avatar-pick-btn" onclick="pickAvatar('🚀')" style="padding: 8px; border-radius: 10px; background: #1e293b; border: 2px solid transparent;">🚀</button>
          <button class="avatar-pick-btn" onclick="pickAvatar('🧱')" style="padding: 8px; border-radius: 10px; background: #1e293b; border: 2px solid transparent;">🧱</button>
          <button class="avatar-pick-btn" onclick="pickAvatar('⚡')" style="padding: 8px; border-radius: 10px; background: #1e293b; border: 2px solid transparent;">⚡</button>
        </div>
      </div>

      <button onclick="saveVkProfile()" class="btn-start" style="width: 100%; justify-content: center; font-size: 14px; padding: 12px;">
        Сохранить профиль
      </button>
    </div>
  </div>

  <!-- MODAL: CONFIRM QUIT -->
  <div class="modal-overlay" id="modal-quit" onclick="closeModalOnOverlay(event, 'modal-quit')">
    <div class="modal-content" style="max-width: 420px; text-align: center;">
      <button class="modal-close" onclick="closeModal('modal-quit')">✕</button>
      <div style="width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 16px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; font-size: 26px;">
        ⚠️
      </div>
      <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px;">
        Прервать викторину?
      </h3>
      <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 20px;">
        Текущий прогресс раунда не сохранится. Вы уверены, что хотите вернуться в главное меню?
      </p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="closeModal('modal-quit')" class="btn-action" style="flex: 1; justify-content: center; font-size: 13px; padding: 10px;">
          Продолжить игру
        </button>
        <button onclick="executeQuit()" class="btn-start" style="flex: 1; justify-content: center; background: linear-gradient(135deg, #e11d48, #be123c); box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3); font-size: 13px; padding: 10px;">
          Да, выйти
        </button>
      </div>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div class="toast" id="achievement-toast">
    <div style="font-size: 26px;" id="toast-icon">⭐</div>
    <div>
      <div style="font-size: 11px; font-weight: 700; color: #818cf8; text-transform: uppercase;">Новое достижение!</div>
      <div style="font-size: 14px; font-weight: 800; color: #fff;" id="toast-title">Турбо-комбо x5</div>
    </div>
  </div>

  <!-- EMBEDDED JAVASCRIPT & DATA -->
  <script>
    // 1. DATASETS
    const AGE_TIERS = ${JSON.stringify(AGE_TIERS, null, 2)};
    const QUESTIONS = ${JSON.stringify(allQuestions, null, 2)};
    const ACHIEVEMENTS = ${JSON.stringify(ACHIEVEMENTS, null, 2)};
    const INITIAL_LEADERBOARD = ${JSON.stringify(INITIAL_LEADERBOARD, null, 2)};

    // 2. AUDIO SYNTHESIZER (Web Audio API - 100% Offline & Asset-free)
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.enabled = true;
        this.loadSettings();
      }

      loadSettings() {
        const saved = localStorage.getItem('quantum_sound_enabled');
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      }

      toggleSound() {
        this.enabled = !this.enabled;
        localStorage.setItem('quantum_sound_enabled', String(this.enabled));
        return this.enabled;
      }

      initCtx() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
        if (!this.enabled) return;
        try {
          this.initCtx();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      }

      playClick() {
        this.playTone(800, 'triangle', 0.05, 0.08);
      }

      playCorrect(streak = 1) {
        if (!this.enabled) return;
        try {
          this.initCtx();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const semitoneShift = Math.min(6, (streak - 1) * 1.5);
          const pitchRatio = Math.pow(2, semitoneShift / 12);
          const freqs = [659.25, 830.61, 987.77, 1318.51].map(f => f * pitchRatio);
          freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.065);
            gain.gain.setValueAtTime(0, now + i * 0.065);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.065 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.065 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.065);
            osc.stop(now + i * 0.065 + 0.35);
          });
        } catch (e) {}
      }

      playWrong() {
        if (!this.enabled) return;
        try {
          this.initCtx();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const tones = [
            { freq: 174.61, time: now, duration: 0.16 },
            { freq: 130.81, time: now + 0.14, duration: 0.24 }
          ];
          tones.forEach(({ freq, time, duration }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.88, time + duration);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(700, time);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(time);
            osc.stop(time + duration);
          });
        } catch (e) {}
      }

      playStreak(streak) {
        if (!this.enabled) return;
        const baseFreq = 440 + Math.min(streak, 10) * 60;
        this.playTone(baseFreq, 'sine', 0.2, 0.15);
      }

      playTick() {
        this.playTone(900, 'sine', 0.03, 0.04);
      }

      playFanfare() {
        if (!this.enabled) return;
        try {
          this.initCtx();
          if (!this.ctx) return;
          const notes = [440, 554.37, 659.25, 880];
          notes.forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 'triangle', 0.35, 0.18), idx * 120);
          });
        } catch (e) {}
      }
    }

    const soundEngine = new SoundEngine();

    // 3. CONFETTI ENGINE (HTML5 Canvas Particles)
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnimId = null;

    function resizeConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfetti);
    resizeConfetti();

    function fireConfetti() {
      confettiParticles = [];
      const colors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
      for (let i = 0; i < 120; i++) {
        confettiParticles.push({
          x: confettiCanvas.width / 2,
          y: confettiCanvas.height * 0.4,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.7) * 16,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.35,
          opacity: 1
        });
      }
      if (!confettiAnimId) {
        animateConfetti();
      }
    }

    function animateConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;
      for (let p of confettiParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0 && p.y < confettiCanvas.height) {
          alive = true;
          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.fillStyle = p.color;
          confettiCtx.globalAlpha = Math.max(0, p.opacity);
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          confettiCtx.restore();
        }
      }
      if (alive) {
        confettiAnimId = requestAnimationFrame(animateConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiAnimId = null;
      }
    }

    // 4. GAME STATE & VARIABLES
    let state = {
      ageGroup: 'kids',
      category: 'vr',
      roundLength: 8,
      activeQuestions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      timeLeft: 35,
      timerInterval: null,
      answered: false,
      participantName: '',
      participantSchool: '',
      userProfile: {
        name: 'Юный Кванторианец',
        vkId: 'quantum_resident',
        avatar: '🤖'
      },
      unlockedAchievements: []
    };

    // Load persisted state
    function loadSavedData() {
      const savedUser = localStorage.getItem('quantum_user_profile');
      if (savedUser) {
        try { state.userProfile = JSON.parse(savedUser); } catch(e) {}
      }
      const savedName = localStorage.getItem('quantum_participant_name');
      if (savedName) {
        state.participantName = savedName;
        const inputN = document.getElementById('participant-name-input');
        if (inputN) inputN.value = savedName;
      }
      const savedSchool = localStorage.getItem('quantum_participant_school');
      if (savedSchool) {
        state.participantSchool = savedSchool;
        const inputS = document.getElementById('participant-school-input');
        if (inputS) inputS.value = savedSchool;
      }
      const savedAch = localStorage.getItem('quantum_unlocked_achievements');
      if (savedAch) {
        try { state.unlockedAchievements = JSON.parse(savedAch); } catch(e) {}
      }
      updateHeaderUser();
      updateAchievementsCounter();
      updateSoundUI();
    }

    function saveParticipantData() {
      const n = document.getElementById('participant-name-input').value;
      const s = document.getElementById('participant-school-input').value;
      state.participantName = n;
      state.participantSchool = s;
      localStorage.setItem('quantum_participant_name', n);
      localStorage.setItem('quantum_participant_school', s);
    }

    function updateHeaderUser() {
      document.getElementById('header-user-name').textContent = state.userProfile.name;
      document.getElementById('header-user-avatar').textContent = state.userProfile.avatar;
    }

    function updateAchievementsCounter() {
      document.getElementById('unlocked-count').textContent = state.unlockedAchievements.length;
    }

    function updateSoundUI() {
      const icon = document.getElementById('sound-icon');
      const label = document.getElementById('sound-label');
      if (soundEngine.enabled) {
        icon.textContent = '🔊';
        label.textContent = 'Звук ВКЛ';
      } else {
        icon.textContent = '🔇';
        label.textContent = 'Звук ВЫКЛ';
      }
    }

    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
      soundEngine.toggleSound();
      updateSoundUI();
    });

    // 5. SELECTION HANDLERS
    function setAgeGroup(age) {
      soundEngine.playClick();
      state.ageGroup = age;
      document.querySelectorAll('.age-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-age') === age);
      });
      updateQuestionsCount();
    }

    function setCategory(cat) {
      soundEngine.playClick();
      state.category = cat;
      document.querySelectorAll('.cat-card').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-cat') === cat);
      });
      updateQuestionsCount();
    }

    function setRoundLength(len) {
      soundEngine.playClick();
      state.roundLength = len;
      document.querySelectorAll('.round-btn').forEach(b => {
        b.classList.toggle('active', Number(b.getAttribute('data-len')) === len);
      });
    }

    function updateQuestionsCount() {
      const filtered = QUESTIONS.filter(q => {
        const matchAge = q.ageGroup === state.ageGroup;
        const matchCat = state.category === 'all' || q.category === state.category;
        return matchAge && matchCat;
      });
      document.getElementById('topic-questions-count').textContent = filtered.length + ' вопросов в подборке';
    }

    // 6. QUIZ FLOW
    function startQuiz() {
      soundEngine.playClick();
      const filtered = QUESTIONS.filter(q => {
        const matchAge = q.ageGroup === state.ageGroup;
        const matchCat = state.category === 'all' || q.category === state.category;
        return matchAge && matchCat;
      });

      if (filtered.length === 0) {
        alert('В выбранной категории пока нет вопросов для данного возраста.');
        return;
      }

      // Helper to randomize the 4 options so correct answers are scattered among A, B, C, D
      function shuffleQuestionOpts(q) {
        const indexed = q.options.map((opt, idx) => ({ opt, isCorrect: idx === q.correctIndex }));
        for (let i = indexed.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
        }
        return {
          ...q,
          options: indexed.map(item => item.opt),
          correctIndex: indexed.findIndex(item => item.isCorrect)
        };
      }

      // Shuffle questions and options
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selected = state.roundLength === 0 ? shuffled : shuffled.slice(0, state.roundLength);
      state.activeQuestions = selected.map(shuffleQuestionOpts);
      state.currentIndex = 0;
      state.score = 0;
      state.streak = 0;
      state.maxStreak = 0;
      state.correctCount = 0;

      // Badges
      const catNames = { vr: '🥽 VR-технологии', robotics: '🤖 Робототехника', lego: '🧱 Легоконструирование', all: '⚡ Квантум Микс' };
      document.getElementById('quiz-cat-badge').textContent = catNames[state.category];
      document.getElementById('quiz-age-badge').textContent = AGE_TIERS[state.ageGroup].ageRange;

      document.getElementById('screen-menu').style.display = 'none';
      document.getElementById('screen-results').style.display = 'none';
      document.getElementById('screen-quiz').style.display = 'block';

      loadQuestion(0);
    }

    function loadQuestion(index) {
      clearInterval(state.timerInterval);
      state.answered = false;
      state.currentIndex = index;

      const q = state.activeQuestions[index];
      const tier = AGE_TIERS[state.ageGroup];

      document.getElementById('current-q-num').textContent = index + 1;
      document.getElementById('total-q-num').textContent = state.activeQuestions.length;
      document.getElementById('quiz-score').textContent = state.score;

      // Question content & visual image
      if (q.imageUrl) {
        document.getElementById('q-img-wrap').style.display = 'block';
        document.getElementById('q-img').src = q.imageUrl;
        document.getElementById('q-img-badge').textContent = q.imageHint || '⚡';
        document.getElementById('q-hint').style.display = 'none';
      } else {
        document.getElementById('q-img-wrap').style.display = 'none';
        document.getElementById('q-hint').style.display = 'block';
        document.getElementById('q-hint').textContent = q.imageHint || '⚡';
      }
      document.getElementById('q-text').textContent = q.question;

      // Hide explanation
      document.getElementById('explanation-container').style.display = 'none';

      // Render options with staggered animation
      const optContainer = document.getElementById('options-container');
      optContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.style.animation = \`slideUp 0.22s cubic-bezier(0.22, 1, 0.36, 1) \${optIdx * 0.05}s both\`;
        btn.innerHTML = \`<span class="option-index">\${letters[optIdx]}</span><span>\${optText}</span>\`;
        btn.onclick = () => selectAnswer(optIdx);
        optContainer.appendChild(btn);
      });

      // Reset timer
      state.timeLeft = tier.timeLimitSeconds;
      updateTimerUI();
      const totalSeconds = tier.timeLimitSeconds;

      state.timerInterval = setInterval(() => {
        state.timeLeft -= 1;
        updateTimerUI(totalSeconds);

        if (state.timeLeft <= 5 && state.timeLeft > 0) {
          soundEngine.playTick();
        }

        if (state.timeLeft <= 0) {
          clearInterval(state.timerInterval);
          onTimeOut();
        }
      }, 1000);
    }

    function updateTimerUI(total) {
      total = total || AGE_TIERS[state.ageGroup].timeLimitSeconds;
      document.getElementById('timer-seconds').textContent = Math.max(0, state.timeLeft);
      const pct = Math.max(0, (state.timeLeft / total) * 100);
      const fill = document.getElementById('timer-fill');
      fill.style.width = pct + '%';
      const timerBox = document.getElementById('timer-box');
      if (state.timeLeft <= 5) {
        timerBox.classList.add('timer-warning');
      } else {
        timerBox.classList.remove('timer-warning');
      }
    }

    function selectAnswer(selectedIndex) {
      if (state.answered) return;
      state.answered = true;
      clearInterval(state.timerInterval);

      const q = state.activeQuestions[state.currentIndex];
      const tier = AGE_TIERS[state.ageGroup];
      const optButtons = document.querySelectorAll('.option-btn');

      optButtons.forEach(btn => btn.disabled = true);

      if (selectedIndex === q.correctIndex) {
        // CORRECT
        soundEngine.playCorrect();
        optButtons[selectedIndex].classList.add('correct');
        state.streak += 1;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        state.correctCount += 1;

        if (state.streak > 1) {
          soundEngine.playStreak(state.streak);
        }

        // Score calc
        const baseScore = 100;
        const timeBonus = Math.floor(state.timeLeft * 3);
        const streakBonus = Math.min(state.streak, 5) * 20;
        const earned = Math.round((baseScore + timeBonus + streakBonus) * tier.multiplier);
        state.score += earned;
        document.getElementById('quiz-score').textContent = state.score;

        document.getElementById('exp-status').textContent = 'Правильно! +' + earned + ' XP 🎉';
        document.getElementById('exp-status').style.color = '#34d399';

        // Check speed achievement
        if (tier.timeLimitSeconds - state.timeLeft < 5) {
          unlockAchievement('speed_demon');
        }
        if (state.streak >= 5) {
          unlockAchievement('combo_5');
        }
      } else {
        // WRONG
        soundEngine.playWrong();
        if (selectedIndex >= 0) {
          optButtons[selectedIndex].classList.add('wrong');
        }
        optButtons[q.correctIndex].classList.add('correct');
        state.streak = 0;

        document.getElementById('exp-status').textContent = 'Не совсем так 💡';
        document.getElementById('exp-status').style.color = '#f87171';
      }

      // Update Streak Indicator
      const streakInd = document.getElementById('streak-indicator');
      if (state.streak > 1) {
        streakInd.style.display = 'flex';
        document.getElementById('streak-count').textContent = state.streak;
      } else {
        streakInd.style.display = 'none';
      }

      // Explanation & Fact
      document.getElementById('exp-text').textContent = q.explanation;
      document.getElementById('fact-text').textContent = q.fact;
      document.getElementById('explanation-container').style.display = 'block';

      // Last question button text
      const nextBtn = document.getElementById('btn-next-question');
      if (state.currentIndex === state.activeQuestions.length - 1) {
        nextBtn.innerHTML = '<span>Завершить викторину</span><span>🏆</span>';
      } else {
        nextBtn.innerHTML = '<span>Следующий вопрос</span><span>➔</span>';
      }
    }

    function onTimeOut() {
      selectAnswer(-1);
    }

    function nextQuestion() {
      soundEngine.playClick();
      if (state.currentIndex < state.activeQuestions.length - 1) {
        loadQuestion(state.currentIndex + 1);
      } else {
        finishQuiz();
      }
    }

    function finishQuiz() {
      clearInterval(state.timerInterval);
      soundEngine.playFanfare();
      fireConfetti();

      // Achievements check
      unlockAchievement('first_quiz');
      if (state.score > 2000) unlockAchievement('high_scorer');
      const total = state.activeQuestions.length;
      const accuracy = Math.round((state.correctCount / total) * 100);

      if (accuracy === 100) {
        if (state.category === 'vr') unlockAchievement('vr_adept');
        if (state.category === 'robotics') unlockAchievement('robotics_pro');
        if (state.category === 'lego') unlockAchievement('lego_master');
        if (state.ageGroup === 'seniors') unlockAchievement('senior_champion');
      }

      // Populate results
      document.getElementById('res-score').textContent = state.score;
      document.getElementById('res-accuracy').textContent = accuracy + '%';
      document.getElementById('res-correct').textContent = state.correctCount + '/' + total;
      document.getElementById('res-maxstreak').textContent = state.maxStreak;

      if (accuracy >= 90) {
        document.getElementById('res-badge').textContent = '🌟';
        document.getElementById('res-title').textContent = 'Грандиозный триумф!';
        document.getElementById('res-subtitle').textContent = 'Идеальные инженерные знания технопарка!';
      } else if (accuracy >= 60) {
        document.getElementById('res-badge').textContent = '🚀';
        document.getElementById('res-title').textContent = 'Отличная работа!';
        document.getElementById('res-subtitle').textContent = 'Прекрасный уровень подготовки!';
      } else {
        document.getElementById('res-badge').textContent = '💡';
        document.getElementById('res-title').textContent = 'Хорошая попытка!';
        document.getElementById('res-subtitle').textContent = 'Продолжай изучать технологии в Квантуме Добра!';
      }

      // Save to local leaderboard
      saveToLeaderboard(state.score, accuracy);

      document.getElementById('screen-quiz').style.display = 'none';
      document.getElementById('screen-results').style.display = 'block';
    }

    function confirmQuit() {
      soundEngine.playClick();
      document.getElementById('modal-quit').classList.add('open');
    }

    function executeQuit() {
      soundEngine.playClick();
      closeModal('modal-quit');
      clearInterval(state.timerInterval);
      showMenu();
    }

    function showMenu() {
      soundEngine.playClick();
      document.getElementById('screen-quiz').style.display = 'none';
      document.getElementById('screen-results').style.display = 'none';
      document.getElementById('screen-menu').style.display = 'block';
    }

    function restartQuiz() {
      startQuiz();
    }

    // 7. ACHIEVEMENTS SYSTEM
    function unlockAchievement(id) {
      if (state.unlockedAchievements.includes(id)) return;
      state.unlockedAchievements.push(id);
      localStorage.setItem('quantum_unlocked_achievements', JSON.stringify(state.unlockedAchievements));
      updateAchievementsCounter();

      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        showToast(ach.title, ach.icon);
      }
    }

    function showToast(title, icon) {
      const toast = document.getElementById('achievement-toast');
      document.getElementById('toast-title').textContent = title;
      document.getElementById('toast-icon').textContent = icon;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // 8. LEADERBOARD SYSTEM
    function getLeaderboard() {
      const saved = localStorage.getItem('quantum_leaderboard_custom');
      if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
      }
      return INITIAL_LEADERBOARD;
    }

    function saveToLeaderboard(score, accuracy) {
      let list = getLeaderboard();
      const newEntry = {
        id: 'user_' + Date.now(),
        name: state.userProfile.name,
        vkId: state.userProfile.vkId,
        avatar: state.userProfile.avatar,
        score: score,
        accuracy: accuracy,
        category: state.category,
        ageGroup: state.ageGroup,
        badgesCount: state.unlockedAchievements.length,
        date: 'Сегодня'
      };
      list.push(newEntry);
      list.sort((a, b) => b.score - a.score);
      localStorage.setItem('quantum_leaderboard_custom', JSON.stringify(list.slice(0, 20)));
    }

    function openLeaderboard() {
      soundEngine.playClick();
      const list = getLeaderboard();
      const podium = document.getElementById('leaderboard-podium');
      const listContainer = document.getElementById('leaderboard-list');

      // Top 3
      const top3 = list.slice(0, 3);
      podium.innerHTML = '';
      const slots = ['first', 'second', 'third'];
      const medals = ['🥇', '🥈', '🥉'];
      top3.forEach((item, idx) => {
        const slot = document.createElement('div');
        slot.className = 'podium-slot ' + slots[idx];
        const isEmoji = !item.avatar.startsWith('http');
        const avHtml = isEmoji ? \`<div style="font-size:24px; margin-bottom:4px;">\${item.avatar}</div>\` : \`<img src="\${item.avatar}" class="podium-avatar">\`;
        slot.innerHTML = \`
          <div style="font-size: 16px; margin-bottom: 2px;">\${medals[idx]}</div>
          \${avHtml}
          <div class="podium-name">\${item.name}</div>
          <div class="podium-score">\${item.score} XP</div>
        \`;
        podium.appendChild(slot);
      });

      // Remaining list
      listContainer.innerHTML = '';
      list.slice(3, 10).forEach((item, idx) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.justifyContent = 'space-between';
        row.style.padding = '8px 12px';
        row.style.background = 'rgba(30, 41, 59, 0.5)';
        row.style.borderRadius = '10px';
        row.style.marginBottom = '6px';
        row.style.fontSize = '13px';

        const isEmoji = !item.avatar.startsWith('http');
        const avHtml = isEmoji ? item.avatar : '👤';
        row.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:800; color:#94a3b8; width:20px;">#\${idx + 4}</span>
            <span>\${avHtml}</span>
            <span style="font-weight:700; color:#fff;">\${item.name}</span>
          </div>
          <div style="font-weight:800; color:#38bdf8;">\${item.score} XP</div>
        \`;
        listContainer.appendChild(row);
      });

      document.getElementById('modal-leaderboard').classList.add('open');
    }

    // 9. ACHIEVEMENTS MODAL
    function openAchievements() {
      soundEngine.playClick();
      const container = document.getElementById('achievements-list');
      container.innerHTML = '';

      ACHIEVEMENTS.forEach(ach => {
        const isUnlocked = state.unlockedAchievements.includes(ach.id);
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '14px';
        item.style.padding = '12px 14px';
        item.style.background = isUnlocked ? 'rgba(8, 47, 73, 0.5)' : 'rgba(30, 41, 59, 0.4)';
        item.style.border = isUnlocked ? '1px solid #06b6d4' : '1px solid #334155';
        item.style.borderRadius = '14px';
        item.style.opacity = isUnlocked ? '1' : '0.6';

        item.innerHTML = \`
          <div style="font-size: 32px; filter: \${isUnlocked ? 'none' : 'grayscale(100%)'};">\${ach.icon}</div>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
              <span style="font-size:14px; font-weight:800; color:#fff;">\${ach.title}</span>
              \${isUnlocked ? '<span style="font-size:10px; background:#06b6d4; color:#020617; font-weight:800; padding:1px 6px; border-radius:9999px;">Получено</span>' : ''}
            </div>
            <div style="font-size:12px; color:#94a3b8;">\${ach.description}</div>
          </div>
        \`;
        container.appendChild(item);
      });

      document.getElementById('modal-achievements').classList.add('open');
    }

    // 10. VK MODAL
    let selectedAvatar = '🤖';
    function pickAvatar(av) {
      soundEngine.playClick();
      selectedAvatar = av;
      document.querySelectorAll('.avatar-pick-btn').forEach(btn => {
        btn.style.borderColor = btn.textContent === av ? '#06b6d4' : 'transparent';
      });
    }

    function openVkModal() {
      soundEngine.playClick();
      document.getElementById('input-username').value = state.userProfile.name;
      document.getElementById('input-vkid').value = state.userProfile.vkId;
      selectedAvatar = state.userProfile.avatar;
      pickAvatar(selectedAvatar);
      document.getElementById('modal-vk').classList.add('open');
    }

    function saveVkProfile() {
      soundEngine.playClick();
      const name = document.getElementById('input-username').value.trim() || 'Юный Кванторианец';
      const vkid = document.getElementById('input-vkid').value.trim() || 'quantum_user';

      state.userProfile = {
        name: name,
        vkId: vkid,
        avatar: selectedAvatar
      };
      localStorage.setItem('quantum_user_profile', JSON.stringify(state.userProfile));
      updateHeaderUser();
      unlockAchievement('vk_connected');
      closeModal('modal-vk');
    }

    // Modal helpers
    function closeModal(id) {
      document.getElementById(id).classList.remove('open');
    }
    function closeModalOnOverlay(e, id) {
      if (e.target.id === id) {
        closeModal(id);
      }
    }

    // CERTIFICATE MODAL & CANVAS GENERATION
    let currentCertCanvas = null;
    let currentCertId = '';

    function openCertificateModal() {
      soundEngine.playClick();
      saveParticipantData();

      const inputN = document.getElementById('participant-name-input');
      const inputS = document.getElementById('participant-school-input');

      const modalN = document.getElementById('cert-modal-name');
      const modalS = document.getElementById('cert-modal-school');

      if (modalN) modalN.value = inputN ? inputN.value : (state.participantName || '');
      if (modalS) modalS.value = inputS ? inputS.value : (state.participantSchool || '');

      if (!currentCertId) {
        currentCertId = 'QD-2026-' + Math.floor(1000 + Math.random() * 9000) + '-' + state.category.toUpperCase();
      }
      document.getElementById('cert-modal-id').textContent = currentCertId;

      document.getElementById('modal-certificate').classList.add('open');
      updateCertPreview();
    }

    function drawCertCanvasData(data) {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      const w = 1920, h = 1080;

      // Background
      const bg = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, 1200);
      bg.addColorStop(0, '#0d1527');
      bg.addColorStop(0.5, '#050a14');
      bg.addColorStop(1, '#02040a');
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,w,h);

      // Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1.5;
      for(let x=0; x<w; x+=60) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for(let y=0; y<h; y+=60) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

      // Frame
      const frameGrad = ctx.createLinearGradient(0,0,w,h);
      frameGrad.addColorStop(0, '#06b6d4');
      frameGrad.addColorStop(0.5, '#3b82f6');
      frameGrad.addColorStop(1, '#eab308');
      ctx.strokeStyle = frameGrad;
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, w-100, h-100);

      // Emblem Atom
      ctx.save();
      ctx.translate(w/2, 150);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0,0,38,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
      for(let i=0; i<3; i++) {
        ctx.save(); ctx.rotate((i*Math.PI)/3);
        ctx.beginPath(); ctx.ellipse(0,0,34,12,0,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fill();
      ctx.restore();

      // Header Text
      ctx.textAlign = 'center';
      ctx.font = '900 24px sans-serif'; ctx.fillStyle = '#38bdf8';
      ctx.fillText('ДЕТСКИЙ ТЕХНОПАРК «КВАНТУМ ДОБРА»', w/2, 235);

      const isWin = data.accuracy >= 80;
      ctx.font = '900 52px sans-serif';
      ctx.fillStyle = isWin ? '#fde047' : '#38bdf8';
      ctx.fillText(isWin ? 'ДИПЛОМ ПОБЕДИТЕЛЯ' : 'СЕРТИФИКАТ УЧАСТНИКА', w/2, 305);

      ctx.font = '500 18px sans-serif'; ctx.fillStyle = '#94a3b8';
      ctx.fillText('НАУЧНО-ТЕХНИЧЕСКОЙ ВИКТОРИНЫ ПО ИННОВАЦИЯМ', w/2, 342);

      ctx.font = '400 18px sans-serif'; ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Настоящий сертификат подтверждает, что', w/2, 415);

      // Name
      ctx.font = '900 48px sans-serif'; ctx.fillStyle = '#ffffff';
      ctx.fillText(data.name || 'Участник Квантума', w/2, 480);
      ctx.fillStyle = '#06b6d4'; ctx.fillRect(w/2 - 250, 502, 500, 3);

      if (data.school) {
        ctx.font = '600 22px sans-serif'; ctx.fillStyle = '#e2e8f0';
        ctx.fillText(data.school, w/2, 545);
      }

      ctx.font = '400 19px sans-serif'; ctx.fillStyle = '#94a3b8';
      ctx.fillText('успешно прошел(ла) испытания викторины по направлению:', w/2, 610);

      // Cat pill
      ctx.fillStyle = 'rgba(15,23,42,0.8)'; ctx.strokeStyle = 'rgba(6,182,212,0.5)'; ctx.lineWidth = 2;
      ctx.fillRect(w/2 - 340, 635, 680, 54);
      ctx.strokeRect(w/2 - 340, 635, 680, 54);
      ctx.font = '800 24px sans-serif'; ctx.fillStyle = '#38bdf8';
      ctx.fillText(data.categoryTitle.toUpperCase(), w/2, 671);

      // Badges
      const badges = [
        { label: 'ВОЗРАСТ', val: data.ageTitle, color: '#38bdf8' },
        { label: 'НАБРАНО ОЧКОВ', val: data.score + ' XP', color: '#fde047' },
        { label: 'ТОЧНОСТЬ', val: data.accuracy + '%', color: '#4ade80' },
        { label: 'РЕЗУЛЬТАТ', val: data.correctCount + ' из ' + data.totalCount, color: '#c084fc' }
      ];
      let bx = w/2 - (4 * 260 + 3 * 40)/2;
      badges.forEach(b => {
        ctx.fillStyle = 'rgba(15,23,42,0.7)'; ctx.strokeStyle = b.color + '66'; ctx.lineWidth = 1.5;
        ctx.fillRect(bx, 730, 260, 75); ctx.strokeRect(bx, 730, 260, 75);
        ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText(b.label, bx + 130, 756);
        ctx.font = '900 22px sans-serif'; ctx.fillStyle = b.color; ctx.fillText(b.val, bx + 130, 788);
        bx += 300;
      });

      // Footer Date & ID
      ctx.textAlign = 'left'; ctx.font = '600 15px sans-serif'; ctx.fillStyle = '#94a3b8';
      ctx.fillText('Дата: ' + data.dateStr, 120, h - 130);
      ctx.fillText('ID Сертификата: ' + data.certId, 120, h - 100);

      return canvas;
    }

    function updateCertPreview() {
      const modalN = document.getElementById('cert-modal-name');
      const modalS = document.getElementById('cert-modal-school');

      const name = (modalN && modalN.value.trim()) || state.participantName || 'Участник Квантума';
      const school = (modalS && modalS.value.trim()) || state.participantSchool || '';

      const catTitles = { vr: 'VR-технологии', robotics: 'Робототехника', lego: 'Легоконструирование', all: 'Квантум Микс' };
      const ageTitles = { kids: '6–9 лет', juniors: '10–13 лет', seniors: '14+ лет' };

      const totalQ = state.activeQuestions.length || 8;
      const acc = Math.round((state.correctCount / totalQ) * 100);

      const data = {
        name: name,
        school: school,
        categoryTitle: catTitles[state.category] || 'Квантум Микс',
        ageTitle: ageTitles[state.ageGroup] || '10–13 лет',
        score: state.score,
        accuracy: acc,
        correctCount: state.correctCount,
        totalCount: totalQ,
        dateStr: new Date().toLocaleDateString('ru-RU'),
        certId: currentCertId
      };

      currentCertCanvas = drawCertCanvasData(data);
      document.getElementById('cert-img-preview').src = currentCertCanvas.toDataURL('image/png');
    }

    function downloadCertFromModal() {
      soundEngine.playClick();
      if (!currentCertCanvas) updateCertPreview();
      const link = document.createElement('a');
      link.download = 'Certificate_Quantum_Dobra.png';
      link.href = currentCertCanvas.toDataURL('image/png');
      link.click();
    }

    function printCertFromModal() {
      soundEngine.playClick();
      if (!currentCertCanvas) updateCertPreview();
      const win = window.open('', '_blank');
      if (win) {
        win.document.write('<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;" onload="window.print();"><img src="' + currentCertCanvas.toDataURL('image/png') + '" style="max-width:100vw;max-height:100vh;object-fit:contain;"/></body></html>');
        win.document.close();
      }
    }

    document.getElementById('btn-open-leaderboard').addEventListener('click', openLeaderboard);
    document.getElementById('btn-open-achievements').addEventListener('click', openAchievements);
    document.getElementById('btn-open-vk').addEventListener('click', openVkModal);

    // Initial setup
    loadSavedData();
    updateQuestionsCount();
  </script>
</body>
</html>`;

const outputPath = path.join(process.cwd(), 'public', 'quantum_dobra_quiz.html');
fs.writeFileSync(outputPath, htmlContent, 'utf-8');
console.log(`Standalone HTML successfully generated at ${outputPath} (${htmlContent.length} bytes)`);
