import { LeaderboardEntry } from '../types';

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb_1',
    name: 'Артём Волков',
    vkId: 'artem_robotics',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    score: 3450,
    accuracy: 95,
    category: 'robotics',
    ageGroup: 'seniors',
    badgesCount: 7,
    date: 'Сегодня, 14:20'
  },
  {
    id: 'lb_2',
    name: 'Полина Смирнова',
    vkId: 'polina_vr_queen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    score: 3120,
    accuracy: 100,
    category: 'vr',
    ageGroup: 'juniors',
    badgesCount: 6,
    date: 'Вчера, 18:45'
  },
  {
    id: 'lb_3',
    name: 'Михаил Ковалёв',
    vkId: 'misha_lego_lab',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    score: 2890,
    accuracy: 90,
    category: 'lego',
    ageGroup: 'juniors',
    badgesCount: 5,
    date: '2 дня назад'
  },
  {
    id: 'lb_4',
    name: 'Даниил и Лев (Тандем)',
    vkId: 'danya_quantum',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    score: 2650,
    accuracy: 88,
    category: 'all',
    ageGroup: 'kids',
    badgesCount: 4,
    date: '3 дня назад'
  },
  {
    id: 'lb_5',
    name: 'Алиса Морозова',
    vkId: 'alice_xr_dev',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    score: 2420,
    accuracy: 92,
    category: 'vr',
    ageGroup: 'seniors',
    badgesCount: 6,
    date: '19 сен'
  },
  {
    id: 'lb_6',
    name: 'Илья Сидоров',
    vkId: 'ilya_technic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    score: 2180,
    accuracy: 85,
    category: 'lego',
    ageGroup: 'kids',
    badgesCount: 3,
    date: '18 сен'
  }
];
