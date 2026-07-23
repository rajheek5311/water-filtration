import { Radar } from 'react-chartjs-2';
import '@/lib/chartSetup';
import type { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

interface RadarChartProps {
  labels: string[];
  series: { label: string; data: number[]; color: string }[];
  height?: number;
}

export default function RadarChart({ labels, series, height = 320 }: RadarChartProps) {
  const { theme } = useTheme();
  const grid = theme === 'dark' ? 'rgba(120,170,255,0.12)' : 'rgba(28,106,242,0.10)';
  const tick = theme === 'dark' ? '#9aa7c7' : '#64748b';

  const data: ChartData<'radar'> = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.data,
      borderColor: s.color,
      backgroundColor: s.color + '33',
      pointBackgroundColor: s.color,
      pointRadius: 3,
      borderWidth: 2,
    })),
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: tick, font: { size: 11, family: 'Inter' }, usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(15,24,46,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: theme === 'dark' ? '#fff' : '#1a3c8f',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
        borderColor: grid,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      r: {
        angleLines: { color: grid },
        grid: { color: grid },
        pointLabels: { color: tick, font: { size: 10 } },
        ticks: { color: tick, backdropColor: 'transparent', font: { size: 9 } },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  );
}
