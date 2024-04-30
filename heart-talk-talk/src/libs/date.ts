export const getCurrentDayData = () => {
  const now = new Date();

  return Number(`${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`);
};
