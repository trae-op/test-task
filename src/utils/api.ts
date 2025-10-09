// utils/api.ts

// Тип для даних користувача (залишається той самий)
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

/**
 * Отримує дані користувача за його ID, використовуючи fetch.
 * @param userId - ID користувача.
 * @returns Проміс (Promise), що містить дані користувача.
 */
export async function fetchUserById(userId: number): Promise<User> {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;

  const response = await fetch(url);

  if (!response.ok) {
    // Кидаємо помилку, якщо HTTP статус не 200-299
    throw new Error(`Failed to fetch user. Status: ${response.status}`);
  }

  // fetch повертає дані, які потрібно розпарсити як JSON
  const data: User = await response.json();

  return data;
}
