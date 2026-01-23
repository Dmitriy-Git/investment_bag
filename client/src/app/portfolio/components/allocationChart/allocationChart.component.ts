import { ChangeDetectionStrategy, Component, computed, input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { PortfolioPosition } from '../../../models/portfolio.model';

@Component({
  selector: 'portfolio-allocation-chart',
  imports: [NgxEchartsDirective],
  templateUrl: './allocationChart.component.html',
  styleUrl: './allocationChart.component.scss',
  // OnPush: компонент проверяется только при изменении input-свойств
  // Повышает производительность, предотвращает лишние проверки
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationChartComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  readonly portfolioValue = input.required<PortfolioPosition[]>();
  readonly isBrowser = computed(() => isPlatformBrowser(this.platformId));

  readonly chartOptions = computed(() => {
    const positions = this.portfolioValue();

    // Группируем позиции по инструментам и рассчитываем общую стоимость
    const instrumentGroups = positions.reduce((acc, position) => {
      const totalValue = Number(position.quantity) * Number(position.purchasePrice);
      if (acc[position.instrumentId]) {
        acc[position.instrumentId].value += totalValue;
      } else {
        acc[position.instrumentId] = {
          value: totalValue,
          name: position.notes || position.instrumentId, // Используем notes если есть, иначе instrumentId
        };
      }
      return acc;
    }, {} as Record<string, { value: number; name: string }>);

    // Преобразуем в формат для ECharts
    const chartData = Object.values(instrumentGroups).map(({ name, value }) => ({
      name,
      value: Math.round(value * 100) / 100, // Округляем до 2 знаков
    }));

    return {
      title: {
        text: 'Распределение портфеля',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ₽ ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Стоимость',
          type: 'pie',
          radius: '50%',
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {d}%',
          },
        },
      ],
      color: [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
      ],
    };
  });
}
