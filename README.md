# Dashboard System Documentation

## Overview
This system consists of interconnected dashboard components that handle different aspects of performance tracking: Predator (Sales), Marketing, and Personal achievements.

## Core Components

### Main Dashboard
- `PredatorDashboard.tsx` - Primary dashboard component
  - Parent component for Marketing and Personal dashboards
  - Integrates with `sheets.ts` for data
  - Features `TargetBarChart` component for sales metrics

### Specialized Dashboards
1. **Marketing Dashboard**
   - `MarketingDashboard.tsx`
   - Data source: `marketingsheets.ts`
   - Features `MarketingTargetBarChart` for marketing metrics

2. **Personal Dashboard**
   - `PersonalDashboard.tsx`
   - Data sources: 
     - `achievements.ts` - Achievement system logic
     - `personalAchievements.tsx` - Personal metrics display
   - Displays achievement progress in bar chart format

## Data Structure

### Achievements System (`achievements.ts`)
// Type definitions
TierType: 'bronze' | 'silver' | 'gold' | 'none'
CategoryType: 'sales' | 'marketing' | 'personal'

// Main interfaces
Achievement: Base achievement structure
Goal: Extended achievement with progress tracking
AchievementsData: Complete achievement data structure

## Naming Conventions

1. **Files**
   - Component files (.tsx): PascalCase
     - Example: `PredatorDashboard.tsx`, `MarketingDashboard.tsx`
   - Data/utility files (.ts): camelCase
     - Example: `achievements.ts`, `marketingsheets.ts`

2. **Components**
   - React Components: PascalCase
     - Example: `PredatorDashboard`, `TargetBarChart`

3. **TypeScript Declarations**
   - Interfaces: PascalCase
     - Example: `Achievement`, `Goal`, `AchievementsData`
   - Types: PascalCase
     - Example: `TierType`, `CategoryType`

4. **Functions and Variables**
   - Functions: camelCase
     - Example: `fetchAchievements()`
   - Variables: camelCase
     - Example: `spreadsheetId`, `libraryResponse`

## Data Flow
graph TD
    PD[PredatorDashboard] --> MD[MarketingDashboard]
    PD --> PERD[PersonalDashboard]
    sheets.ts --> PD
    marketingsheets.ts --> MD
    achievements.ts --> PERD
    personalAchievements.tsx --> PERD

## File Structure
app/
├── components/
│   ├── dashboard/
│   │   ├── PredatorDashboard.tsx
│   │   ├── MarketingDashboard.tsx
│   │   ├── PersonalDashboard.tsx
│   │   ├── achievements.ts
│   │   ├── personalAchievements.tsx
│   │   ├── sheets.ts
│   │   └── marketingsheets.ts
│   └── charts/
│       ├── TargetBarChart.tsx
│       └── MarketingTargetBarChart.tsx

## Contributing Guidelines
1. Follow established naming conventions
2. Maintain the hierarchical dashboard structure
3. Keep data fetching logic separate from display components
4. Use TypeScript interfaces for type safety
5. Document any new components or significant changes