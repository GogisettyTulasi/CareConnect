/**
 * Mock data for development when Spring Boot backend is not running.
 * Used only by service layer - components never import this.
 */

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const MOCK_USERS = [
  { id: '1', email: 'user@careconnect.com', name: 'Demo User', role: 'USER' },
  { id: '2', email: 'admin@careconnect.com', name: 'Admin User', role: 'ADMIN' },
  { id: '3', email: 'coord@careconnect.com', name: 'Coordinator', role: 'COORDINATOR' },
];

export const MOCK_DONATIONS = [
  { id: '1', title: 'Rice & Lentils', category: 'Food', description: 'Unopened bags', quantity: 2, donorId: '1', status: 'AVAILABLE', createdAt: '2025-02-20T10:00:00Z' },
  { id: '2', title: 'Winter Jackets', category: 'Clothes', description: 'Adult sizes', quantity: 5, donorId: '1', status: 'AVAILABLE', createdAt: '2025-02-19T14:00:00Z' },
  { id: '3', title: 'Canned Goods', category: 'Food', description: 'Various cans', quantity: 10, donorId: '2', status: 'RESERVED', createdAt: '2025-02-18T09:00:00Z' },
];

export const MOCK_REQUESTS = [
  { id: '1', donationId: '1', requesterId: '2', status: 'PENDING', message: 'Need for family', createdAt: '2025-02-20T11:00:00Z' },
  { id: '2', donationId: '3', requesterId: '1', status: 'ACCEPTED', message: 'Shelter need', createdAt: '2025-02-19T12:00:00Z' },
];

export function getMockAuth(email, password) {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user || password !== 'password') return null;
  return { token: 'mock-jwt-' + user.id, user };
}

export function getMockDonations() {
  return [...MOCK_DONATIONS];
}

export function getMockRequests() {
  return [...MOCK_REQUESTS];
}

export { delay };
