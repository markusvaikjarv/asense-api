import 'jest';
import { hashSHA256 } from '../src/utils';

// Placeholder for further tests

describe('utils', () => {
  describe('hashSHA256', () => {
    it('should hash string to SHA-256', () => {
      const input = 'abc';
      const hash = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'; // SHA-256 hash of 'abc'

      expect(hashSHA256(input)).toBe(hash);
    });
  });
});
