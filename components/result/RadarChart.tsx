'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  scores: {
    knowledge: number;
    skill: number;
    experience: number;
    environment: number;
  };
}

const LABELS: Record<string, string> = {
  knowledge: '知識',
  skill: '技術',
  experience: '経験',
  environment: '環境',
};

export default function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { subject: LABELS.knowledge, score: scores.knowledge, fullMark: 100 },
    { subject: LABELS.skill, score: scores.skill, fullMark: 100 },
    { subject: LABELS.experience, score: scores.experience, fullMark: 100 },
    { subject: LABELS.environment, score: scores.environment, fullMark: 100 },
  ];

  return (
    <div className="w-full" style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 14, fontWeight: 600, fill: '#374151' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            tickCount={5}
          />
          <Radar
            name="スコア"
            dataKey="score"
            stroke="#1565C0"
            fill="#1565C0"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
