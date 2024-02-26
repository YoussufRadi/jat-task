import { Game } from '@modules/game/gameModel';

import { PlayResult } from './gameTypes';

export const games: Game = {};

const mapNumberToMove = (num: number): -1 | 0 | 1 => {
  if (num === 1) return -1;
  if (num === 2) return 1;
  return 0;
};

const calculatePlayAndScore = (score: number): PlayResult => {
  const play = mapNumberToMove(score % 3);
  score += play;
  score /= 3;
  return { play, newScore: score };
};

export const gameRepository = {
  exists: (gameUuid: string): boolean => games[gameUuid] != undefined,
  find: (gameUuid: string): number => games[gameUuid]!,
  start: (gameUuid: string, score: number): boolean => {
    if (gameRepository.exists(gameUuid)) return false;
    games[gameUuid] = score;
    return true;
  },
  play: (gameUuid: string): PlayResult => {
    const score = gameRepository.find(gameUuid);
    const { play, newScore } = calculatePlayAndScore(score);
    games[gameUuid] = newScore;
    return { play, newScore };
  },
  updateScore: (gameUuid: string, score: number): boolean => {
    const oldScore = gameRepository.find(gameUuid);
    if (oldScore == 1) return false;
    const { newScore } = calculatePlayAndScore(oldScore);
    if (newScore != score) return false;
    games[gameUuid] = newScore;
    return true;
  },
};
