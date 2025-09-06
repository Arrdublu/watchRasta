'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/lib/articles';

const COLLECTION_KEY = 'watchRastaFavorites';

export function useCollection() {
  const [collection, setCollection] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(COLLECTION_KEY);
      if (item) {
        setCollection(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error reading from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const saveCollection = useCallback((newCollection: Article[]) => {
    try {
      setCollection(newCollection);
      window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(newCollection));
    } catch (error) {
      console.warn('Error writing to localStorage', error);
    }
  }, []);

  const addToCollection = useCallback((article: Article) => {
    // Avoid adding duplicates
    if (!collection.some(item => item.id === article.id)) {
      saveCollection([...collection, article]);
    }
  }, [collection, saveCollection]);

  const removeFromCollection = useCallback((articleId: number) => {
    saveCollection(collection.filter((item) => item.id !== articleId));
  }, [collection, saveCollection]);

  const isInCollection = useCallback((articleId: number) => {
    return collection.some((item) => item.id === articleId);
  }, [collection]);

  return { collection, addToCollection, removeFromCollection, isInCollection, isLoaded };
}
