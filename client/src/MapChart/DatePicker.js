import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles.css';

const DatePickerComponent = ({ selectedFromDate, selectedToDate, onFromDateChange, onToDateChange, selectedEndDate }) => {
  const specificStartDates = [];
  const specificEndDates = [];
  const startDate = new Date(2024, 5, 26);  

  for (let date = new Date(startDate); date <= (selectedToDate || selectedEndDate); date.setDate(date.getDate() + 1)) {
    specificStartDates.push(new Date(date));
  }

  if (selectedFromDate) {
    for (let date = new Date(selectedFromDate); date <= selectedEndDate; date.setDate(date.getDate() + 1)) {
      specificEndDates.push(new Date(date));
    }
  }

  return (
    <div className="date-picker">
      <div className="date-picker-container">
        <label className="date-label">From:</label>
        <DatePicker
          selected={selectedFromDate}
          onChange={date => onFromDateChange(date)}
          dateFormat="yyyy-MM-dd"
          includeDates={specificStartDates}
          maxDate={selectedToDate || selectedEndDate}
          popperPlacement="top-start"
        />
      </div>
      <div className="date-picker-container">
        <label className="date-label">To:</label>
        <DatePicker
          selected={selectedToDate}
          onChange={date => onToDateChange(date)}
          dateFormat="yyyy-MM-dd"
          includeDates={specificEndDates}
          minDate={selectedFromDate || startDate}
          maxDate={selectedEndDate}
          popperPlacement="top-start"
        />
      </div>
    </div>
  );
};

export default DatePickerComponent;
