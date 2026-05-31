const formatTime = (dateObj, isLive, sport) => {
  if (!dateObj) return '';
  if (!isLive) {
    const d = new Date(dateObj);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matchDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    let prefix;
    if (matchDay.getTime() === today.getTime()) {
      prefix = 'Сегодня';
    } else if (matchDay.getTime() === tomorrow.getTime()) {
      prefix = 'Завтра';
    } else {
      prefix = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }

    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${prefix}, ${time}`;
  }

  const elapsedMin = Math.floor((Date.now() - new Date(dateObj).getTime()) / 60000);

  if (elapsedMin > 180) return 'Live';

  const name = (sport || '').toLowerCase();

  if (name === 'basketball' || name === 'баскетбол') {
    const quarter = Math.min(Math.floor(elapsedMin / 12) + 1, 4);
    const minInQ = elapsedMin % 12;
    return `Q${quarter} ${minInQ}:00`;
  }

  if (name === 'football' || name === 'футбол') {
    if (elapsedMin < 45) return `${elapsedMin}'`;
    if (elapsedMin < 60) return `45+'`;
    const half2 = elapsedMin - 15;
    if (half2 < 90) return `${half2}'`;
    return `90+'`;
  }

  return `${elapsedMin}'`;
};

module.exports = { formatTime };
