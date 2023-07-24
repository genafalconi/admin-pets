import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function ChartComponent({ totalImportBuy, totalImportSell, totalExpenses, totalProfit, percentage }) {

  const options = {
    animationEnabled: true,
    subtitles: [
      {
        text: `${percentage}%`,
        verticalAlign: 'center',
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    data: [
      {
        type: 'doughnut',
        showInLegend: true,
        indexLabel: '{name}: {y}',
        yValueFormatString: "'$'#,###",
        dataPoints: [
          { name: 'Compras', y: totalImportBuy },
          { name: 'Ventas', y: totalImportSell },
          { name: 'Gastos', y: totalExpenses },
          { name: 'Ganancia', y: totalProfit },
        ],
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart options={options} />
    </div>
  );
};