import '../../styles/components/month-year-picker.scss';

export default function MonthYearPicker({ selectedMonth, selectedYear, onChange }) {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    'Todo el año'
  ];

  const startYear = 2020;
  const endYear = 2025;

  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  const handleMonthChange = (e) => {
    const month = e.target.value;
    onChange(month, selectedYear);
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    onChange(selectedMonth, year);
  };

  return (
    <div className="month-year-picker">
      <span className='select-picker'>Selecciona: </span>
      <select className="month-select" value={selectedMonth} onChange={handleMonthChange}>
        <option disabled value="">Month</option>
        {months.map((month, index) => (
          <option key={index} value={index}>
            {month}
          </option>
        ))}
      </select>
      <select className="year-select" value={selectedYear} onChange={handleYearChange}>
        <option value="">Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
