import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry, CategoryId, AgeGroup, VkUser } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const COLLECTION_NAME = 'leaderboard';

/**
 * Sanitize doc ID for Firestore
 */
function sanitizeDocId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 100);
}

/**
 * Subscribe to real-time shared leaderboard updates from Firestore
 */
export function subscribeToCloudLeaderboard(
  currentUserId: string,
  onUpdate: (entries: LeaderboardEntry[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('score', 'desc'),
    limit(100)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items: LeaderboardEntry[] = [];
      snapshot.forEach((document) => {
        const data = document.data();
        if (data && data.id) {
          items.push({
            id: data.id,
            name: data.name || 'Анонимный кванторианец',
            vkId: data.vkId || undefined,
            avatar:
              data.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            score: Number(data.score) || 0,
            accuracy: Number(data.accuracy) || 0,
            category: (data.category as CategoryId) || 'all',
            ageGroup: (data.ageGroup as AgeGroup) || 'juniors',
            badgesCount: Number(data.badgesCount) || 0,
            date: 'Сегодня',
            isCurrentUser: data.id === currentUserId,
          });
        }
      });

      items.sort((a, b) => b.score - a.score);
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
    }
  );

  return unsubscribe;
}

/**
 * Save or update player's entry in Firestore cloud leaderboard
 */
export async function savePlayerToCloud(
  participantName: string,
  participantSchool: string,
  user: VkUser | null,
  score: number,
  accuracy: number,
  category: CategoryId,
  ageGroup: AgeGroup,
  badgesCount: number
): Promise<void> {
  try {
    const rawId = user?.id || localStorage.getItem('quantum_client_id') || `client_${Math.random().toString(36).substring(2, 9)}`;
    if (!user && !localStorage.getItem('quantum_client_id')) {
      localStorage.setItem('quantum_client_id', rawId);
    }

    const docId = sanitizeDocId(rawId);
    const displayName =
      participantName.trim() ||
      (user ? `${user.first_name} ${user.last_name}` : 'Резидент Квантума');

    const avatar =
      user?.photo_200 ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

    const payload = {
      id: rawId,
      name: displayName,
      vkId: user?.isVkConnected ? user.id : '',
      avatar,
      score,
      accuracy,
      category,
      ageGroup,
      badgesCount,
      school: participantSchool || '',
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, COLLECTION_NAME, docId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
  }
}

/**
 * Clear all records in shared cloud leaderboard
 */
export async function clearCloudLeaderboardAll(): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
  }
}
