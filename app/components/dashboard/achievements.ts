// Types
export type TierType = 'bronze' | 'silver' | 'gold' | 'none';
export type CategoryType = 'sales' | 'marketing' | 'personal';

export interface Achievement {
  id: string;
  title: string;
  category: CategoryType;
  tier: TierType;
  description: string;
  target: number;
  trait: string;
  icon: string;
  isSecret: boolean;
}

export interface Goal extends Achievement {
  type: 'goal' | 'achievement';
  status: 'active' | 'completed' | 'failed';
  startDate: string;
  endDate: string | null;
  progress: number;
}

export interface AchievementsData {
  library: Achievement[];
  goalsAndAchievements: Goal[];
  activeGoals: Goal[];
  completedAchievements: Goal[];
}

export async function fetchAchievements(): Promise<AchievementsData | null> {
  try {
    const spreadsheetId = "1NdCBL0usG_V7LlZBMfB43E48T3_NB5itV5ZeOsGAhJE";
    const apiKey = "AIzaSyA8xFp3JzgFdgbSTdUjO7wMI32yz0NVKGQ";
    
    const [libraryResponse, goalsResponse] = await Promise.all([
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Achievement%20Library!A2:I1000?key=${apiKey}`),
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Goals%20%26%20Achievements!A2:M1000?key=${apiKey}`)
    ]);

    const libraryData = await libraryResponse.json();
    const goalsData = await goalsResponse.json();

    // Parse achievement library
    const achievementLibrary = libraryData.values?.map((row: string[]) => ({
      id: row[0],
      title: row[1],
      category: row[2] as CategoryType,
      tier: row[3] as TierType,
      description: row[4],
      target: Number(row[5]),
      trait: row[6],
      icon: row[7],
      isSecret: row[8] === 'TRUE'
    })) || [];

    // Parse goals and achievements
    const goalsAndAchievements = goalsData.values?.map((row: string[]) => ({
      id: row[0],
      type: row[1] as 'goal' | 'achievement',
      category: row[2] as CategoryType,
      tier: row[3] as TierType,
      title: row[4],
      description: row[5],
      target: Number(row[6]),
      trait: row[7],
      status: row[8] as 'active' | 'completed' | 'failed',
      startDate: row[9],
      endDate: row[10],
      progress: Number(row[11]),
      isSecret: row[12] === 'TRUE'
    })) || [];

    // Add these console.logs
    console.log('Parsed goals and achievements:', goalsAndAchievements);
    console.log('Active goals:', goalsAndAchievements.filter((g: Goal) => g.status === 'active'));

    const activeGoals = goalsAndAchievements.filter((g: Goal) => g.status === 'active');
    console.log('Found active goals:', activeGoals);

    return {
      library: achievementLibrary,
      goalsAndAchievements,
      activeGoals,
      completedAchievements: goalsAndAchievements.filter((g: Goal) => g.status === 'completed')
    };

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return null;
  }
}