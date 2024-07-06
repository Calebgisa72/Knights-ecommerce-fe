export function FormatPosted(createdTime: Date) {
  const createdDate = createdTime.getTime();
  const currentDate = Date.now();
  const timeDifference = currentDate - createdDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} Year ago`;
  } else if (months > 0) {
    return `${months} Month ago`;
  } else if (weeks > 0) {
    return `${weeks} ${weeks > 1 ? 'Weeks' : 'Week'} ago`;
  } else if (days > 0) {
    return `${days} ${days > 1 ? 'Days' : 'Day'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours > 1 ? 'Hours' : 'Hour'} ago`;
  } else if (minutes > 0) {
    return `${minutes} Minute ago`;
  } else {
    return `${seconds} Second ago`;
  }
}

export function calculateRate(newPrices: string, oldPrices: string) {
  const newPrice = Number(newPrices);
  const oldPrice = Number(oldPrices);
  if (oldPrice > newPrice) {
    const difference = oldPrice - newPrice;
    const rate = (difference / oldPrice) * 100;
    return Math.floor(rate);
  }
  return;
}
