import { Bar } from 'react-chartjs-2';
import '@/lib/chartSetup';
import type { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
  yLabel?: string;
  height?: number;
  horizontal?: boolean;
}

export default function BarChart({ labels, datasets, yLabel, height = 260, horizontal = false }: BarChartProps) {
  const { theme } = useTheme();
  const grid = theme === 'dark' ? 'rgba(120,170,255,0.10)' : 'rgba(28,106,242,0.08)';
  const tick = theme === 'dark' ? '#9aa7c7' : '#64748b';

  const data: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((d) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.color + 'cc',
      borderColor: d.color,
      borderWidth: 1.5,
      borderRadius: 6,
      barPercentage: 0.7,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
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
      x: { ticks: { color: tick, font: { size: 10 } }, grid: { color: grid } },
      y: {
        ticks: { color: tick, font: { size: 10 } },
        grid: { color: grid },
        title: yLabel ? { display: true, text: yLabel, color: tick, font: { size: 10 } } : undefined,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}
