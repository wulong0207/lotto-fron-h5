// 解析投注信息
// drawCode 号码
// sepKind 分隔符
// sepChild 子号码分隔符
export function transContent(drawCode, sepKind = '|', sepChild = ',') {
  drawCode = drawCode || '';
  let arr = drawCode.split(sepKind);
  let pre = arr[0].split(sepChild); // 前驱
  let suf; // 后驱
  if (arr[1]) suf = arr[1].split(sepChild);

  return { pre, suf, preStr: arr[0], sufStr: arr[1] };
}

// 金额格式化
export function toMoney(s, n) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  let l = s
    .split('.')[0]
    .split('')
    .reverse();
  let r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
  }
  return (
    t
      .split('')
      .reverse()
      .join('') +
    '.' +
    r
  );
}
