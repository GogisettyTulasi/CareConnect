import api from './api';
import { delay } from '../utils/mockData';
import {
  isBackendUnavailable,
  getRequestsFromStorage,
  saveRequestsToStorage,
  getDonationsFromStorage,
  saveDonationsToStorage,
} from '../utils/storageFallback';

const REQUESTS_BASE = '/api/requests';
const USE_MOCK = import.meta.env.VITE_MOCK_API === 'true';

function nextId() {
  return String(Date.now());
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('careconnect_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function joinRequestsWithDonations(requests) {
  const donations = getDonationsFromStorage();
  return requests.map((r) => ({
    ...r,
    donation: donations.find((d) => d.id === r.donationId) || { title: 'Unknown', category: '-' },
  }));
}

/**
 * GET /api/requests - list all requests
 */
export const getRequests = async (params = {}) => {
  if (USE_MOCK) {
    await delay(200);
    let list = getRequestsFromStorage();
    if (params.donationId) list = list.filter((r) => r.donationId === params.donationId);
    if (params.status) list = list.filter((r) => r.status === params.status);
    return list;
  }
  try {
    const { data } = await api.get(REQUESTS_BASE, { params });
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      let list = getRequestsFromStorage();
      if (params.donationId) list = list.filter((r) => r.donationId === params.donationId);
      if (params.status) list = list.filter((r) => r.status === params.status);
      return list;
    }
    throw err;
  }
};

/**
 * POST /api/requests - create a request
 * On failure: save to localStorage so "My Requests" shows it; persist across refresh.
 */
export const createRequest = async (payload) => {
  if (USE_MOCK) {
    await delay(300);
    const user = getStoredUser();
    const newReq = {
      id: nextId(),
      ...payload,
      requesterId: user?.id || '1',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    const list = getRequestsFromStorage();
    list.unshift(newReq);
    saveRequestsToStorage(list);
    const donations = getDonationsFromStorage();
    const donIdx = donations.findIndex((d) => d.id === payload.donationId);
    if (donIdx !== -1) {
      donations[donIdx] = { ...donations[donIdx], status: 'RESERVED' };
      saveDonationsToStorage(donations);
    }
    return newReq;
  }
  try {
    const { data } = await api.post(REQUESTS_BASE, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(300);
      const user = getStoredUser();
      const newReq = {
        id: nextId(),
        ...payload,
        requesterId: user?.id || '1',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      const list = getRequestsFromStorage();
      list.unshift(newReq);
      saveRequestsToStorage(list);
      const donations = getDonationsFromStorage();
      const donIdx = donations.findIndex((d) => d.id === payload.donationId);
      if (donIdx !== -1) {
        donations[donIdx] = { ...donations[donIdx], status: 'RESERVED' };
        saveDonationsToStorage(donations);
      }
      return newReq;
    }
    throw err;
  }
};

/**
 * GET /api/requests/my - current user's requests (persisted from localStorage when offline)
 */
export const getMyRequests = async () => {
  if (USE_MOCK) {
    await delay(200);
    const user = getStoredUser();
    const list = getRequestsFromStorage().filter((r) => r.requesterId === user?.id);
    return joinRequestsWithDonations(list);
  }
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/my`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      const user = getStoredUser();
      const list = getRequestsFromStorage().filter((r) => r.requesterId === user?.id);
      return joinRequestsWithDonations(list);
    }
    throw err;
  }
};

/**
 * PATCH /api/requests/:id
 */
export const updateRequest = async (id, payload) => {
  if (USE_MOCK) {
    await delay(200);
    const list = getRequestsFromStorage();
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Request not found');
    list[idx] = { ...list[idx], ...payload };
    saveRequestsToStorage(list);
    return list[idx];
  }
  try {
    const { data } = await api.patch(`${REQUESTS_BASE}/${id}`, payload);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      const list = getRequestsFromStorage();
      const idx = list.findIndex((x) => x.id === id);
      if (idx === -1) throw new Error('Request not found');
      list[idx] = { ...list[idx], ...payload };
      saveRequestsToStorage(list);
      return list[idx];
    }
    throw err;
  }
};

/**
 * GET /api/requests/accepted - for coordinator
 */
export const getAcceptedRequests = async () => {
  if (USE_MOCK) {
    await delay(200);
    const list = getRequestsFromStorage().filter((r) => r.status === 'ACCEPTED');
    return joinRequestsWithDonations(list);
  }
  try {
    const { data } = await api.get(`${REQUESTS_BASE}/accepted`);
    return data;
  } catch (err) {
    if (isBackendUnavailable(err)) {
      await delay(200);
      const list = getRequestsFromStorage().filter((r) => r.status === 'ACCEPTED');
      return joinRequestsWithDonations(list);
    }
    throw err;
  }
};
