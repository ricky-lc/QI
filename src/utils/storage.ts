import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestResult, UserProfile, PracticeRecord } from '../types';

const PROFILE_KEY = '@qi_user_profile';
const RESULTS_KEY = '@qi_results';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    if (data) return JSON.parse(data) as UserProfile;
  } catch {
    // ignore
  }
  const newProfile: UserProfile = {
    id: generateId(),
    createdAt: Date.now(),
    results: [],
    practiceHistory: [],
  };
  await saveUserProfile(newProfile);
  return newProfile;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export async function saveResult(result: TestResult): Promise<void> {
  const profile = await getUserProfile();
  profile.results = [result, ...profile.results].slice(0, 50); // keep last 50
  await saveUserProfile(profile);
}

export async function getRecentResults(limit = 10): Promise<TestResult[]> {
  const profile = await getUserProfile();
  return profile.results.slice(0, limit);
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([PROFILE_KEY, RESULTS_KEY]);
  } catch {
    // ignore
  }
}

export async function savePracticeRecord(record: PracticeRecord): Promise<void> {
  const profile = await getUserProfile();
  profile.practiceHistory = [record, ...profile.practiceHistory].slice(0, 100);
  await saveUserProfile(profile);
}

export async function getPracticeHistory(type?: string): Promise<PracticeRecord[]> {
  const profile = await getUserProfile();
  if (type) return profile.practiceHistory.filter((r) => r.type === type);
  return profile.practiceHistory;
}
