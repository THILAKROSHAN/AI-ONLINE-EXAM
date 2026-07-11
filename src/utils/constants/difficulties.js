// Difficulty Constants
export const DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const DIFFICULTY_LABELS = {
  [DIFFICULTIES.EASY]: 'Easy',
  [DIFFICULTIES.MEDIUM]: 'Medium',
  [DIFFICULTIES.HARD]: 'Hard',
};

export const DIFFICULTY_COLORS = {
  [DIFFICULTIES.EASY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [DIFFICULTIES.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [DIFFICULTIES.HARD]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const DIFFICULTY_ICONS = {
  [DIFFICULTIES.EASY]: '🟢',
  [DIFFICULTIES.MEDIUM]: '🟡',
  [DIFFICULTIES.HARD]: '🔴',
};

export const DIFFICULTY_SCORES = {
  [DIFFICULTIES.EASY]: 1,
  [DIFFICULTIES.MEDIUM]: 2,
  [DIFFICULTIES.HARD]: 3,
};

export const DIFFICULTY_ORDER = [DIFFICULTIES.EASY, DIFFICULTIES.MEDIUM, DIFFICULTIES.HARD];

export const isValidDifficulty = (difficulty) => {
  return Object.values(DIFFICULTIES).includes(difficulty);
};

export const getDifficultyLabel = (difficulty) => {
  return DIFFICULTY_LABELS[difficulty] || difficulty;
};

export const getDifficultyColor = (difficulty) => {
  return DIFFICULTY_COLORS[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export const getDifficultyIcon = (difficulty) => {
  return DIFFICULTY_ICONS[difficulty] || '⚪';
};

export const getDifficultyScore = (difficulty) => {
  return DIFFICULTY_SCORES[difficulty] || 0;
};

export default {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  DIFFICULTY_ICONS,
  DIFFICULTY_SCORES,
  DIFFICULTY_ORDER,
  isValidDifficulty,
  getDifficultyLabel,
  getDifficultyColor,
  getDifficultyIcon,
  getDifficultyScore,
};