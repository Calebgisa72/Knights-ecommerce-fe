export default function formatDateAndTime(isoString: Date) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    date: formattedDate,
    time: formattedTime
  };
}
