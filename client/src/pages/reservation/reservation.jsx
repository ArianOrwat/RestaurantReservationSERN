import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from 'axios';

import setAuthToken from '../../utils/setAuthToken';

import "react-datepicker/dist/react-datepicker.css";
import "./reservation.scss";

import { faHome, faUser, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Reservation = () => {
  const [startDate, setStartDate] = useState();
  const [peopleAPI, setPeopleAPI] = useState();
  const [peopleUserPick, setPeopleUserPick] = useState(0);
  const [tables, setTables] = useState();
  const [choosedTable, setChoosedTable] = useState();
  const [choosedHour, setChoosedHour] = useState('10:00:00');

  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }

  function addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  const isSunday = date => {
    const day = date.getDay();
    return day !== 0;
  };

  useEffect(() => {
    axios.get('/api/tables/people').then(({data}) => { setPeopleAPI(data); setPeopleUserPick(data[0])});
  }, [])

  useEffect(() => {
    if(peopleUserPick && startDate) {
      tablesRequest(peopleUserPick, startDate);
    }
  }, [peopleUserPick, startDate]);

  useEffect(() => {

  }, [choosedHour])

  // const dataChange = date => {
  //     setStartDate(date);
  // }

  // const peopleChange = people => {
  //     setPeopleUserPick(people);
  // }

  const tablesRequest = (people, date) => {
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    axios.get(`/api/tables/${day}/${month}/${year}/${people}`).then(({data}) => setTables(data));
  }

  const reservation = (table_id) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const time = choosedHour.split(':');
    const hours = time[0];
    const minutes = time[1];
    const day = startDate.getDate();
    const month = startDate.getMonth()+1;
    const year = startDate.getFullYear();
    console.log(minutes, hours, day, month, year);
    const body = JSON.stringify({minutes, hours, day, month, year, table_id});
    console.log(body);
    try{
      axios.post('/api/tables', body, config);
    } catch(err) {
      console.log(err);
    }
    
  }

  const resultsActive = () => {
    const reser = document.getElementById('results');
    reser.classList.add('active');
  }

  return (
  <>
    <div className="helper"></div>
      <div className="reservation">  
      <div className="reservation__search">
        <FontAwesomeIcon icon={faUser} className='reservation__icon'/>
        <select onChange={e => setPeopleUserPick(e.target.value)} className='reservation__select' value={peopleUserPick}>
          {
            peopleAPI ?
            peopleAPI.map(people => <option value={people} key={`people-${people}`}>{people}</option>)
            : <option value="" disabled>no tables</option>
          }
        </select>
          <FontAwesomeIcon icon={faCalendarAlt} className='reservation__icon reservation__icon__space'/>
          <DatePicker
            selected={startDate}
            onChange={date => {setStartDate(date); resultsActive();}}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            filterDate={isSunday}
            placeholderText="Choose date"
            className="datepicker"
          />
      </div> 
    </div>
    <div className="results" id='results'>
        {
          tables &&
          tables.resultEnd.map(table => <div className='results__table' key={`results__table-${table.id}`}>
              <div className="img"></div>
              <div className="results__table__info">
                <div>Window: {table.window ? 'Yes' : 'No'}</div>
                <div>For {table.people} person</div>
              </div>
              {
                choosedTable !== table.id && <button className='results__table__choose' onClick={() => {setChoosedTable(table.id)}}>Choose</button>
              }
              {
                choosedTable && choosedTable === table.id && <div className='results__table__group'><select onChange={e => setChoosedHour(e.target.value)} className='results__table__time'>
                {
                  table.hours.map(hour => <option value={hour} key={`table__hour-${hour}`}>{hour}</option>)
                }
              </select>
              <button className='results__table__reservation' onClick={() => reservation(table.id)}>Reservation</button></div>

              }
            </div>)
        }
        </div>
    </>
  );
};

export default Reservation;
