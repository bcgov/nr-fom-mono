import { FeatureTypeCode } from "./feature-type-code";

describe('FeatureTypeCode', () => {

  describe('getInstance', () => {

    it ('instance description is populated', async () => {
      expect(FeatureTypeCode.getInstance('cut_block').description).toBe('Cut Block');
    });

    it ('instance null if invalid code', async () => {
      expect(FeatureTypeCode.getInstance('not exist')).toBeUndefined();
    });

  });

});
