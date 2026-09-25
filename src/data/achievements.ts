import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quiz',
    title: 'Первый квант знаний',
    description: 'Заверши свою самую первую викторину в технопарке',
    icon: '🌱',
    category: 'general',
    conditionDescription: 'Завершить 1 любую игру'
  },
  {
    id: 'combo_5',
    title: 'Турбо-комбо x5',
    description: 'Дай 5 правильных ответов подряд в одном раунде',
    icon: '⚡',
    category: 'streak',
    conditionDescription: 'Стрик 5 верных ответов'
  },
  {
    id: 'speed_demon',
    title: 'Молния Квантума',
    description: 'Ответь правильно быстрее чем за 5 секунд',
    icon: '⏱️',
    category: 'general',
    conditionDescription: 'Быстрый ответ < 5 сек'
  },
  {
    id: 'vr_adept',
    title: 'Кибер-навигатор VR',
    description: 'Заверши трек Виртуальной реальности с точностью 100%',
    icon: '🥽',
    category: 'vr',
    conditionDescription: '100% верных ответов в VR'
  },
  {
    id: 'robotics_pro',
    title: 'Инженер роботов',
    description: 'Заверши трек Робототехники с точностью 100%',
    icon: '🤖',
    category: 'robotics',
    conditionDescription: '100% верных ответов в Робототехнике'
  },
  {
    id: 'lego_master',
    title: 'Мастер шестерёнок',
    description: 'Заверши трек Легоконструирования с точностью 100%',
    icon: '🧱',
    category: 'lego',
    conditionDescription: '100% верных ответов в LEGO'
  },
  {
    id: 'vk_connected',
    title: 'Резидент Квантума',
    description: 'Подключи свой профиль VK ID для таблицы лидеров',
    icon: '💙',
    category: 'general',
    conditionDescription: 'Авторизоваться через VK'
  },
  {
    id: 'high_scorer',
    title: 'Золотой резерв',
    description: 'Набери более 2 000 очков за одну викторину',
    icon: '🏆',
    category: 'streak',
    conditionDescription: 'Счет > 2000 очков'
  },
  {
    id: 'senior_champion',
    title: 'Архитектор будущего',
    description: 'Пройди сложнейший уровень 14+ без единой ошибки',
    icon: '🧠',
    category: 'general',
    conditionDescription: '100% точность на уровне 14+'
  }
];
