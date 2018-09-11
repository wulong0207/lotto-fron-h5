/**
 * 投注内容解析
 * 
 * @export
 * @param {string} content 投注内容 
 * @returns Array<{
 *  type: enum('s', 'r'), 胜平负(s)或让球胜平负(r)
 *  value: enum(3, 1, 0), 胜(3)平(1)负(0)
 *  let: int 让球数, 胜平负时让球数为 0
 * }>
 */
export function parseMatchContent(content) {
  return content.split('_').map(bet => {
    const type = getBetType(bet);
    const betContent = /[a-zA-Z]/.test(bet.substring(0, 1))
      ? bet.substring(1)
      : bet;
    return {
      type,
      value: parseBetResult(betContent),
      let: type === 'r' ? parseInt(/\[((-|\+)?\d+)\]/.exec(bet)[1]) : 0
    };
  });
}

/**
 * 解析单项投注内容
 * 
 * @param {string} bet 
 * @returns Array<enum(3, 1, 0)> 投注结果
 */
function parseBetResult(bet) {
  // const betContent = bet.substring(0, 1) === '(' ? bet : bet.substring(1);
  return bet
    .replace(/\[-?\+?\d+\]/, '')
    .replace(/[()]/g, '')
    .split(',')
    .map(m => parseInt(m.split('@')[0]));
}

function getBetType(bet) {
  const typeLetter = bet.substring(0, 1).toLowerCase();
  if (/[a-z]/.test(typeLetter)) {
    return typeLetter;
  }
  if (typeLetter === '(') return 's';
  if (typeLetter === '[') return 'r';
}
