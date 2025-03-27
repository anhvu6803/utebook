import { useState, useEffect, useRef } from 'react';
import './styles/CustomDateInput.scss';

const CustomDateInput = ({ name, value, onChange, required }) => {
  const dateInputRef = useRef(null);
  const [displayValue, setDisplayValue] = useState('');

  // Chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy để hiển thị
  const formatForDisplay = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('/')) return dateString;
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd cho input type="date"
  const formatForDateInput = (dateString) => {
    if (!dateString) return '';
    if (dateString.includes('-')) return dateString;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setDisplayValue(formatForDisplay(value));
  }, [value]);

  const handleClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value; // yyyy-mm-dd
    const formattedDate = formatForDisplay(newDate);
    setDisplayValue(formattedDate);
    onChange({
      target: {
        name,
        value: newDate
      }
    });
  };

  return (
    <div className="custom-date-input" onClick={handleClick}>
      <input
        type="text"
        value={displayValue}
        readOnly
        placeholder="dd/mm/yyyy"
        required={required}
      />
      <input
        ref={dateInputRef}
        type="date"
        value={formatForDateInput(value)}
        onChange={handleDateChange}
        className="date-picker"
      />
    </div>
  );
};

export default CustomDateInput; 