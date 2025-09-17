/**
 * Преобразует дату в формат "Месяц день, год в чч:мм"
 * @param isoString string
 * @returns Месяц день, год в чч:мм
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12; // 12-часовой формат
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = date.getHours() >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${year} в ${hours}:${minutes} ${period}`;
}
