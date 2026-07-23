import { Doughnut } from 'react-chartjs-2';
import '@/lib/chartSetup';
import type { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  colors: string[];
  height?: number;
}

export default function DoughnutChart({ labels, data, colors, height = 220 }: DoughnutChartProps) {
  const { theme } = useTheme();
  const tick = theme === 'dark' ? '#9aa7c7' : '#64748b';

  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: theme === 'dark' ? 'rgba(15,24,46,0.8)' : 'rgba(255,255,255,0.9)',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: tick, font: { size: 11, family: 'Inter' }, usePointStyle: true, boxWidth: 8, padding: 14 },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(15,24,46,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: theme === 'dark' ? '#fff' : '#1a3c8f',
        bodyColor: theme === 'dark' ? '#cbd5e1' : '#475569',
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
