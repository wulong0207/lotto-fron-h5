import { parseMatchContent } from './match';

test('多玩法投注内容解析', () => {
  expect(parseMatchContent('S(3@2.32)_R[-1](1@3.85)')).toEqual([
    { type: 's', value: [3], let: 0 },
    { type: 'r', value: [1], let: -1 }
  ]);
});

test('多玩法投注内容解析', () => {
  expect(parseMatchContent('R[+1](0@4.15)')).toEqual([
    { type: 'r', value: [0], let: 1 }
  ]);
});
