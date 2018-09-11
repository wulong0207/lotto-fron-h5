import { getLotteryName } from './index';

test('获取彩种名字', () => {
  expect(getLotteryName(300)).toBe('竞彩足球');
  expect(getLotteryName(301)).toBe('竞彩篮球');
  expect(getLotteryName(400)).toBe('');
});
