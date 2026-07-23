import { Line } from 'react-chartjs-2';
import '@/lib/chartSetup';
import type { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

interface LineTrendProps {
  labels: string[];
  datasets: { label: string; data: (number | null)[]; color: string }[];
  yLabel?: string;
  height?: number;
}

export default function LineTrend({ labels, datasets, yLabel, height = 240 }: LineTrendProps) {
  const { theme } = useTheme();
  const grid = theme === 'dark' ? 'rgba(120,170,255,0.10)' : 'rgba(28,106,242,0.08)';
  const tick = theme === 'dark' ? '#9aa7c7' : '#64748b';

  const data: ChartData<'line'> = {
    labels,
    datasets: datasets.map((d) => ({
      label: d.label,
      data: d.data,
      borderColor: d.color,
      backgroundColor: d.color + '22',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: d.color,
      borderWidth: 2.5,
    })),
  };

  const options: ChartOptions<'line'> = {
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
      x: { ticks: { color: tick, font: { size: 10 } }, grid: { color: grid } },
      y: {
        ticks: { color: tick, font: { size: 10 } },
        grid: { color: grid },
        title: yLabel ? { display: true, text: yLabel, color: tick, font: { size: 10 } } : undefined,
        beginAtZero: false,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
