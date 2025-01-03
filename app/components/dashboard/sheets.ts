// app/lib/sheets.ts

function safeRate(value: any): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

interface SheetData {
  date: string;
  outbound: number;
  triage: number;
  triageRate: number;
  appointments: number;
  setRate: number;
  shows: number;
  showRate: number;
  closes: number;
  closeRate: number;
  revenue: number;
  revenuePerClose: number;
  totalXP: number;
}

interface PersonalData {
  date: string;
  energy: number;
  confidence: number;
  personalXP: number;
}

export async function fetchSheetData(): Promise<SheetData[]> {
  try {
    const spreadsheetId = "1NdCBL0usG_V7LlZBMfB43E48T3_NB5itV5ZeOsGAhJE";
    const apiKey = "AIzaSyA8xFp3JzgFdgbSTdUjO7wMI32yz0NVKGQ";
    const range = 'Sales Analysis!A2:N';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('Raw sheet data:', JSON.stringify(data, null, 2));

    if (!data.values) {
      console.error('No data values returned from Google Sheets');
      return [];
    }

    return data.values.map((row: any[]) => {
      if (!row || row.length < 13) {
        console.warn('Row has insufficient data:', row);
        return {
          date: '',
          outbound: 0,
          triage: 0,
          triageRate: 0,
          appointments: 0,
          setRate: 0,
          shows: 0,
          showRate: 0,
          closes: 0,
          closeRate: 0,
          revenue: 0,
          revenuePerClose: 0,
          totalXP: 0
        };
      }

      return {
        date: row[0] || '',
        outbound: Number(row[1]) || 0,
        triage: Number(row[2]) || 0,
        triageRate: safeRate(row[3]),
        appointments: Number(row[4]) || 0,
        setRate: safeRate(row[5]),
        shows: Number(row[6]) || 0,
        showRate: safeRate(row[7]),
        closes: Number(row[8]) || 0,
        closeRate: safeRate(row[9]),
        revenue: Number(row[10]) || 0,
        revenuePerClose: Number(row[11]) || 0,
        totalXP: row.length >= 13 ? Number(row[12]) : 0
      };
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return [];
  }
}

export async function fetchPersonalData(): Promise<PersonalData[]> {
  try {
    const spreadsheetId = "1NdCBL0usG_V7LlZBMfB43E48T3_NB5itV5ZeOsGAhJE";
    const apiKey = "AIzaSyA8xFp3JzgFdgbSTdUjO7wMI32yz0NVKGQ";
    const range = 'Raw Data!A2:Y';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('Raw personal data:', JSON.stringify(data, null, 2));

    if (!data.values) {
      console.error('No data values returned from Raw Data tab');
      return [];
    }

    return data.values.map((row: any[]) => {
      // We want columns B (1), P (15), Q (16), and Y (24) for date, energy, confidence, and personalXP
      return {
        date: row[1] || '',  // Date is in column B
        energy: Number(row[15]) || 0,  // Energy is in column P
        confidence: Number(row[16]) || 0,  // Confidence is in column Q
        personalXP: Number(row[24]) || 0  // PersonalXP is in column Y
      };
    });
  } catch (error) {
    console.error('Error fetching personal data:', error);
    return [];
  }
}

export function filterDataByDateRange(data: any[], startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.filter(row => {
    try {
      const rowDate = new Date(row.date);
      return rowDate >= start && rowDate <= end;
    } catch {
      return false; // If the date is invalid, skip that row
    }
  });
}

export async function fetchProjections() {
  try {
    const spreadsheetId = "1NdCBL0usG_V7LlZBMfB43E48T3_NB5itV5ZeOsGAhJE";
    const apiKey = "AIzaSyA8xFp3JzgFdgbSTdUjO7wMI32yz0NVKGQ";
    const range = 'Projections!A2:D15';
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) {
      console.error('No projections data returned from sheets');
      return null;
    }

    const projections = data.values.reduce((acc: { [key: string]: Projection }, row: any[]) => {
      const metric = row[0].toLowerCase().replace(' ', '_');
      console.log('Processing projection row:', row, 'metric:', metric);
      acc[metric] = {
        daily: Number(row[1]) || 0,
        weekly: Number(row[2]) || 0,
        monthly: Number(row[3]) || 0
      };
      return acc;
    }, {});

    console.log('Final projections:', projections);
    return projections;

  } catch (error) {
    console.error('Error fetching projections:', error);
    return null;
  }
}

interface Projection {
  daily: number;
  weekly: number;
  monthly: number;
}