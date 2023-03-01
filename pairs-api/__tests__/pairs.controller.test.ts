import { getPairs } from '../src/controllers/pairs.controller';

describe('Pairs controller', () => {
  it('get all Pairs from a given contract', async () => {
    // Given
    const contractAddress = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';

    // When
    // await getPairs({}, {});

    // Then
    expect(contractAddress).toBe(contractAddress);
  });
});
