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
  exists: (playerUuid: string): boolean => games[playerUuid] != undefined,
  find: (playerUuid: string): number => games[playerUuid]!,
  start: (playerUuid: string, score: number): boolean => {
    if (gameRepository.exists(playerUuid)) return false;
    games[playerUuid] = score;
    return true;
  },
  play: (playerUuid: string): PlayResult => {
    const score = gameRepository.find(playerUuid);
    const { play, newScore } = calculatePlayAndScore(score);
    games[playerUuid] = newScore;
    return { play, newScore };
  },
  updateScore: (playerUuid: string, score: number): boolean => {
    const oldScore = gameRepository.find(playerUuid);
    if (oldScore == 1) return false;
    const { newScore } = calculatePlayAndScore(oldScore);
    if (newScore != score) return false;
    games[playerUuid] = newScore;
    return true;
  },
};
