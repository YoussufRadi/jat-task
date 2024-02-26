import { gameRepository, games } from '@modules/game/gameRepository';

describe('gameRepository', () => {
  beforeEach(() => {
    Object.keys(games).forEach((key) => delete games[key]);
  });

  describe('exists', () => {
    it('should return false if player does not exist', () => {
      const gameUuid = 'player1';
      expect(gameRepository.exists(gameUuid)).toBe(false);
    });

    it('should return true if player exists', () => {
      const gameUuid = 'player1';
      games[gameUuid] = 0;
      expect(gameRepository.exists(gameUuid)).toBe(true);
    });
  });

  describe('find', () => {
    it('should return score if player exists', () => {
      const gameUuid = 'player1';
      const score = 10;
      games[gameUuid] = score;
      expect(gameRepository.find(gameUuid)).toBe(score);
    });

    it('should throw an error if player does not exist', () => {
      const gameUuid = 'player1';
      expect(gameRepository.find(gameUuid)).toBe(undefined);
    });
  });

  describe('start', () => {
    it('should start a new game for a player if they do not exist', () => {
      const gameUuid = 'player1';
      const score = 10;
      expect(gameRepository.start(gameUuid, score)).toBe(true);
      expect(games[gameUuid]).toBe(score);
    });

    it('should not start a new game for a player if they already exist', () => {
      const gameUuid = 'player1';
      games[gameUuid] = 5;
      const newScore = 10;
      expect(gameRepository.start(gameUuid, newScore)).toBe(false);
      expect(games[gameUuid]).toBe(5);
    });
  });

  describe('play', () => {
    it('should return a play result and update the score', () => {
      const gameUuid = 'player1';
      const initialScore = 10;
      games[gameUuid] = initialScore;
      const { play, newScore } = gameRepository.play(gameUuid);
      expect(play).toBeDefined();
      expect(newScore).toBeDefined();
      expect(games[gameUuid]).toBe(newScore);
    });
  });

  describe('updateScore', () => {
    it('should update the score if conditions are met', () => {
      const gameUuid = 'player1';
      const initialScore = 10;
      games[gameUuid] = initialScore;
      const newScore = Math.floor(initialScore / 3);
      expect(gameRepository.updateScore(gameUuid, newScore)).toBe(true);
      expect(games[gameUuid]).toBe(newScore);
    });

    it('should not update the score if old score is 1', () => {
      const gameUuid = 'player1';
      const initialScore = 1;
      games[gameUuid] = initialScore;
      const newScore = 10;
      expect(gameRepository.updateScore(gameUuid, newScore)).toBe(false);
      expect(games[gameUuid]).toBe(initialScore);
    });

    it('should not update the score if new score is incorrect', () => {
      const gameUuid = 'player1';
      const initialScore = 10;
      games[gameUuid] = initialScore;
      const newScore = 7;
      expect(gameRepository.updateScore(gameUuid, newScore)).toBe(false);
      expect(games[gameUuid]).toBe(initialScore);
    });
  });
});
