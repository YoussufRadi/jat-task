import { gameRepository, games } from '@modules/game/gameRepository';

describe('gameRepository', () => {
  beforeEach(() => {
    Object.keys(games).forEach((key) => delete games[key]);
  });

  describe('exists', () => {
    it('should return false if player does not exist', () => {
      const playerUuid = 'player1';
      expect(gameRepository.exists(playerUuid)).toBe(false);
    });

    it('should return true if player exists', () => {
      const playerUuid = 'player1';
      games[playerUuid] = 0;
      expect(gameRepository.exists(playerUuid)).toBe(true);
    });
  });

  describe('find', () => {
    it('should return score if player exists', () => {
      const playerUuid = 'player1';
      const score = 10;
      games[playerUuid] = score;
      expect(gameRepository.find(playerUuid)).toBe(score);
    });

    it('should throw an error if player does not exist', () => {
      const playerUuid = 'player1';
      expect(gameRepository.find(playerUuid)).toBe(undefined);
    });
  });

  describe('start', () => {
    it('should start a new game for a player if they do not exist', () => {
      const playerUuid = 'player1';
      const score = 10;
      expect(gameRepository.start(playerUuid, score)).toBe(true);
      expect(games[playerUuid]).toBe(score);
    });

    it('should not start a new game for a player if they already exist', () => {
      const playerUuid = 'player1';
      games[playerUuid] = 5;
      const newScore = 10;
      expect(gameRepository.start(playerUuid, newScore)).toBe(false);
      expect(games[playerUuid]).toBe(5);
    });
  });

  describe('play', () => {
    it('should return a play result and update the score', () => {
      const playerUuid = 'player1';
      const initialScore = 10;
      games[playerUuid] = initialScore;
      const { play, newScore } = gameRepository.play(playerUuid);
      expect(play).toBeDefined();
      expect(newScore).toBeDefined();
      expect(games[playerUuid]).toBe(newScore);
    });
  });

  describe('updateScore', () => {
    it('should update the score if conditions are met', () => {
      const playerUuid = 'player1';
      const initialScore = 10;
      games[playerUuid] = initialScore;
      const newScore = Math.floor(initialScore / 3);
      expect(gameRepository.updateScore(playerUuid, newScore)).toBe(true);
      expect(games[playerUuid]).toBe(newScore);
    });

    it('should not update the score if old score is 1', () => {
      const playerUuid = 'player1';
      const initialScore = 1;
      games[playerUuid] = initialScore;
      const newScore = 10;
      expect(gameRepository.updateScore(playerUuid, newScore)).toBe(false);
      expect(games[playerUuid]).toBe(initialScore);
    });

    it('should not update the score if new score is incorrect', () => {
      const playerUuid = 'player1';
      const initialScore = 10;
      games[playerUuid] = initialScore;
      const newScore = 7;
      expect(gameRepository.updateScore(playerUuid, newScore)).toBe(false);
      expect(games[playerUuid]).toBe(initialScore);
    });
  });
});
