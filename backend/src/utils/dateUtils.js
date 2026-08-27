const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  return formatDate(new Date());
};

const getTomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return formatDate(date);
};

const getYesterdayDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  return formatDate(date);
};

module.exports = {
  getTodayDate,
  getTomorrowDate,
  getYesterdayDate,
};