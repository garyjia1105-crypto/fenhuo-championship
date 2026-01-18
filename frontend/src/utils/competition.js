// 比赛结束时间：2026年2月8日23:59 新西兰时区（NZDT = UTC+13）
// 转换为UTC时间：2026-02-08T10:59:00Z
const END_TIME_UTC = new Date('2026-02-08T10:59:00Z').getTime();

/**
 * 检查比赛是否已结束
 * @returns {boolean} 比赛是否已结束
 */
export const isCompetitionOver = () => {
  const now = new Date().getTime();
  return now >= END_TIME_UTC;
};

/**
 * 计算距离比赛结束的剩余时间
 * @returns {Object} 包含剩余时间信息和是否结束的状态
 */
export const getTimeLeft = () => {
  const now = new Date().getTime();
  const difference = END_TIME_UTC - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isOver: false,
  };
};

/**
 * 获取比赛结束时间（新西兰时区）
 */
export const getEndTime = () => {
  return END_TIME_UTC;
};
