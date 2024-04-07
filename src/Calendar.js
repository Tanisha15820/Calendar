import React, { useState, useEffect } from 'react';
import './Calendar.css';

const GuestInfo = ({ name, email }) => (
  <div className="guest-info">
    <p>Name: {name}</p>
    <p>Email: {email}</p>
  </div>
);

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [indiaTime, setIndiaTime] = useState('');
  const [chromeOpenedTime, setChromeOpenedTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState(null); 
  const [guestName, setGuestName] = useState(''); 
  const [guestEmail, setGuestEmail] = useState(''); 
  const [showForm, setShowForm] = useState(false); 
  const [guestInfo, setGuestInfo] = useState(null); 
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const interval = setInterval(() => {
      const options = { timeZone: 'Asia/Kolkata', hour12: false };
      const indiaTime = new Date().toLocaleTimeString('en-US', options);
      setIndiaTime(indiaTime);
    }, 1000); 

    const chromeOpenedTime = new Date();
    setChromeOpenedTime(chromeOpenedTime);

    return () => clearInterval(interval); 
  }, []);

  const handlePrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleNextButtonClick = () => {
    setShowForm(true); // Show the form
  };

  const handleAddGuest = () => {
    // Add validation here if needed
    if (guestName && guestEmail) {
      setGuestInfo({ name: guestName, email: guestEmail });
      alert(`Guest "${guestName}" with email "${guestEmail}" is added!`);
    } else {
      alert('Please enter both name and email for the guest.');
    }
  };

  const handleNameChange = (event) => {
    setGuestName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setGuestEmail(event.target.value);
  };

  const handleScheduleEvent = () => {
    const eventData = {
      Date: selectedDate,
      Time: selectedTime,
      'Guest Name': guestName,
      'Guest Email': guestEmail,
    };

    // Display information in a popup box
    alert(JSON.stringify(eventData, null, 2));
  };

  const calculateTimeSinceChromeOpened = () => {
    const now = new Date();
    const difference = Math.floor((now - chromeOpenedTime) / 1000);
    return `${Math.floor(difference / 3600)}:${Math.floor((difference % 3600) / 60)}:${difference % 60}`;
  };

  const renderCalendar = () => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();
    const startingDay = new Date(year, month - 1, 1).getDay();
    const days = [];
    
    // Render weekdays
    const weekdayCells = weekdays.map((day, index) => (
      <div key={`weekday-${index}`} className="calendar-day">{day}</div>
    ));
    days.push(...weekdayCells);

    // Fill empty cells before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    // Render days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={`day-${i}`}
          className="calendar-day"
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push(
          <div key={time} className="time-slot">
            <button onClick={() => handleTimeClick(time)}>{time}</button>
          </div>
        );
      }
    }
    return timeSlots;
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        {/* Left side */}
        <div className="left-side">
          <img src="https://png.pngtree.com/png-vector/20221013/ourmid/pngtree-calendar-icon-logo-2023-date-time-png-image_6310337.png" alt="Calendar Icon" />
          <h1> Fidery Demo</h1>
          <p>Book an item with a Fibery team. </p>
          <p>Talk to a real person about how to get your </p>
          <p>processes set up with us or not.</p>
          <div className="info">
            <p>⏰{calculateTimeSinceChromeOpened()}</p>
            {guestInfo && <GuestInfo name={guestInfo.name} email={guestInfo.email} />}
          </div>
        </div>
        {/* Right side */}
        <div className="right-side">
          {/* Year, Month, and Arrow Keys */}
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>&lt;</button>
            <h2>{date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
          {/* Weekdays */}
          <div className="calendar-body">
            {renderCalendar()}
          </div>
          {/* Time Zone Heading */}
          <h3>Time Zone</h3>
          {/* India Time */}
          <p>{indiaTime}</p>
        </div>
      </div>
      {/* Render time slots if a date is selected */}
      {selectedDate !== null && (
        <div className="selected-time-slots">
          {renderTimeSlots()}
          {/* Render buttons below time slots if a time is selected */}
          {selectedTime !== null && (
            <div className="selected-time-buttons">
              <button>{selectedTime}</button>
              <button onClick={handleNextButtonClick}>Next</button>
            </div>
          )}
        </div>
      )}
      {/* Form */}
      {showForm && (
        <div className="form-container">
          <h2>Enter Details</h2>
          <form>
            <div>
              <label>Name:</label>
              <input type="text" onChange={handleNameChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" onChange={handleEmailChange} />
            </div>
            <button type="button" onClick={handleAddGuest}>Add Guest</button>
            <h3>I want Fibery to work for</h3>
            <div>
              <input type="checkbox" />
              <label>Myself</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>&lt;10 People</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>10-50 People</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>50+ People</label>
            </div>
            <h3>You are about to</h3>
            <div>
              <input type="checkbox" />
              <label>Leadership</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Consulting</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Product Management</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Design</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Engineering</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Marketing</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Human Resources</label>
            </div>
            <div>
              <input type="checkbox" />
              <label>Education</label>
            </div>
            <div>
              <label>Please share anything that will help prepare for our meeting</label>
              <input type="text" />
            </div>
            <div>
              <label>Please share with us the name of your Fibery workspace</label>
              <input type="text" />
            </div>
            <button type="button" onClick={handleScheduleEvent}>Schedule Event</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;
