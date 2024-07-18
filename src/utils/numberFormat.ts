export const numFormat = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' M';
  } else if (num >= 1000) {
    return (
      (num / 1000).toString().split('.')[0] +
      '.' +
      ((num / 1000).toString().split('.')[1] ? (num / 1000).toString().split('.')[1][1] + ' K' : '0 K')
    );
  } else {
    return num < 10 ? 0 + num.toString() : num.toString();
  }
};
