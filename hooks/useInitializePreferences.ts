import { useEffect } from 'react';
import { userPreferences } from '@/db/schema';
import { getDb } from '@/utils/db';

const DEFAULT_THEME_ID = 1;
export const useInitPreferences = () => {
  const db = getDb();

  useEffect(() => {
    const initializePreferences = async () => {
      console.log('INIT');
      try {
        const existingPreferences = await db.select().from(userPreferences).limit(1);

        if (existingPreferences.length === 0) {
          await db.insert(userPreferences).values({
            app_theme_id: DEFAULT_THEME_ID,
            app_theme_mode: 'dark',
          });
          console.log('Default preferences initialized');
        }
      } catch (error) {
        console.error('Error initializing preferences:', error);
      }
    };

    initializePreferences();
  }, [db]);
};
