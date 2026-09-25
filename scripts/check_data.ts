import fs from 'fs';
import path from 'path';
import { VR_QUESTIONS } from '../src/data/questions/vr';
import { ROBOTICS_QUESTIONS } from '../src/data/questions/robotics';
import { LEGO_QUESTIONS } from '../src/data/questions/lego';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { INITIAL_LEADERBOARD } from '../src/data/initialLeaderboard';

const allQuestions = [...VR_QUESTIONS, ...ROBOTICS_QUESTIONS, ...LEGO_QUESTIONS];

console.log(`Loaded ${allQuestions.length} questions (VR: ${VR_QUESTIONS.length}, Robotics: ${ROBOTICS_QUESTIONS.length}, LEGO: ${LEGO_QUESTIONS.length})`);
console.log(`Loaded ${ACHIEVEMENTS.length} achievements, ${INITIAL_LEADERBOARD.length} leaderboard entries`);
