import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";
import "./reservation.scss";

const Reservation = () => {
  const [startDate, setStartDate] = useState();
  const [peopleAPI, setPeopleAPI] = useState();
  const [peopleUserPick, setPeopleUserPick] = useState(0);
  const [tables, setTables] = useState();


  function addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  const isMonday = date => {
    const day = date.getDay();
    return day !== 1;
  };

  useEffect(() => {
    axios.get('/api/tables/people').then(({data}) => { setPeopleAPI(data); setPeopleUserPick(data[0])});
    
  }, []);

  const dataChange = date => {
      setStartDate(date);
      tablesRequest(peopleUserPick, date);
  }

  const peopleChange = people => {
    setPeopleUserPick(people);
    tablesRequest(people, startDate);
  }

  const tablesRequest = (people, date) => {
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    axios.get(`/api/tables/${day}/${month}/${year}/${people}`).then(({data}) => setTables(data));
  }

  return (
    <div className="reservation">
      <select onChange={e => peopleChange(e.target.value)} value={peopleUserPick}>
        {
          peopleAPI ?
          peopleAPI.map(people => <option value={people} key={`people-${people}`}>{people}</option>)
          : <option value="" disabled>no tables</option>
        }
      </select>
      <DatePicker
        selected={startDate}
        onChange={date => dataChange(date)}
        dateFormat="dd/MM/yyyy"
        minDate={new Date()}
        maxDate={addDays(new Date(), 30)}
        filterDate={isMonday}
        placeholderText="Choose date"
        className="datepicker"
      />
      <div className="results">
        {
          tables &&
          tables.resultEnd.map(table => <div className='results__table' key={`results__table-${table.id}`}>
              <div>People: {table.people}</div>
              <div>Window: {table.window}</div>
              <select className='time'>
                {
                  table.hours.map(hour => <option value={hour} key={`table__hour-${hour}`}>{hour}</option>)
                }
              </select>
            </div>)
        }
      </div>
    </div>
  );
};

export default Reservation;
