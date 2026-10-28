/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { PracticeStory } from '../types';

export interface CloudScriptRecord {
  id: string;
  dayNumber: number;
  title: string;
  focusSkill: string;
  estimatedReadTime?: string;
  storyParagraphs: string[];
  usefulExpressions: {
    phrase: string;
    meaning: string;
    example: string;
    speakingTip: string;
  }[];
  retellingPrompts: string[];
  reflectionPrompts: string[];
  level?: string;
  topic?: string;
  notes?: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}

// Convert Firestore Cloud Document to PracticeStory
export function cloudRecordToStory(data: CloudScriptRecord): PracticeStory {
  return {
    id: data.id,
    day: data.dayNumber ?? 1,
    title: data.title || 'Untitled Practice Day',
    focusSkill: data.focusSkill || 'Natural spoken flow',
    estimatedReadTime: data.estimatedReadTime || '2 min',
    storyParagraphs: Array.isArray(data.storyParagraphs) ? data.storyParagraphs : [],
    usefulExpressions: Array.isArray(data.usefulExpressions) ? data.usefulExpressions : [],
    retellingPrompts: Array.isArray(data.retellingPrompts) ? data.retellingPrompts : [],
    reflectionPrompts: Array.isArray(data.reflectionPrompts) ? data.reflectionPrompts : [],
    level: data.level || 'A1',
    topic: data.topic || '',
    notes: data.notes || '',
    userId: data.userId,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
}

// Fetch all cloud scripts for a specific user
export async function fetchUserScripts(userId: string): Promise<PracticeStory[]> {
  const collectionPath = `users/${userId}/scripts`;
  try {
    const q = query(collection(db, 'users', userId, 'scripts'), orderBy('dayNumber', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => cloudRecordToStory({ id: d.id, ...d.data() } as CloudScriptRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

// Subscribe to real-time updates for a user's cloud scripts
export function subscribeToUserScripts(
  userId: string,
  onData: (stories: PracticeStory[]) => void,
  onError?: (err: any) => void
) {
  const collectionPath = `users/${userId}/scripts`;
  const q = query(collection(db, 'users', userId, 'scripts'), orderBy('dayNumber', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const stories = snapshot.docs.map((d) =>
        cloudRecordToStory({ id: d.id, ...d.data() } as CloudScriptRecord)
      );
      onData(stories);
    },
    (error: any) => {
      if (
        error?.name === 'AbortError' ||
        error?.code === 'cancelled' ||
        error?.message?.includes('aborted')
      ) {
        return;
      }
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } catch (e) {
        // Logged by handleFirestoreError; prevent bubbling to unhandled rejection in callback
      }
    }
  );
}

// Save (Create or Overwrite) a personal cloud script
export async function saveUserScript(userId: string, story: PracticeStory): Promise<void> {
  const docPath = `users/${userId}/scripts/${story.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'scripts', story.id);
    const payload = {
      dayNumber: Number(story.day) || 1,
      title: story.title.trim() || 'Untitled Day',
      focusSkill: story.focusSkill || '',
      estimatedReadTime: story.estimatedReadTime || '2 min',
      storyParagraphs: story.storyParagraphs || [],
      usefulExpressions: story.usefulExpressions || [],
      retellingPrompts: story.retellingPrompts || [],
      reflectionPrompts: story.reflectionPrompts || [],
      level: story.level || 'A1',
      topic: story.topic || '',
      notes: story.notes || '',
      userId: userId,
      updatedAt: new Date().toISOString(),
      createdAt: story.createdAt || new Date().toISOString(),
    };

    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// Delete a user's cloud script
export async function deleteUserScript(userId: string, scriptId: string): Promise<void> {
  const docPath = `users/${userId}/scripts/${scriptId}`;
  try {
    const docRef = doc(db, 'users', userId, 'scripts', scriptId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// Migrate locally stored custom/edited scripts to Firestore once the user signs in
export async function syncLocalScriptsToCloud(
  userId: string,
  localCustom: PracticeStory[],
  localEditedMap: Record<string, PracticeStory>
): Promise<number> {
  let count = 0;
  const itemsToUpload = [...localCustom, ...Object.values(localEditedMap)];
  for (const story of itemsToUpload) {
    try {
      await saveUserScript(userId, story);
      count++;
    } catch (e) {
      console.warn(`Failed to sync story ${story.id} to cloud:`, e);
    }
  }
  return count;
}
