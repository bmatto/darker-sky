import { useState, useEffect } from 'react';

const PORTSMOUTH_HOURLY_URL =
  'https://api.weather.gov/gridpoints/GYX/63,28/forecast/hourly';

const calculateForecastGeneratedAt = (forecastData) => {
  if (!forecastData) {
    return '...';
  }

  const forecastDate = new Date(forecastData.properties.generatedAt);

  return `${forecastDate.toLocaleDateString()} - ${forecastDate.toLocaleTimeString()}`;
};

const Hour = (props) => {
  const startTime = new Date(props.startTime);
  const endTime = new Date(props.endTime);

  return (
    <div>
      {startTime.toLocaleTimeString()} - {endTime.toLocaleTimeString()} :{' '}
      <img src={props.icon} />
      {props.shortForecast} {`${props.temperature}${props.temperatureUnit}`}
    </div>
  );
};

const Days = (props) => {
  const days = props.periods.reduce((accum, hour) => {
    const date = new Date(hour.startTime).getDate();
    const previousDate = accum.length
      ? new Date(accum[accum.length - 1].slice(-1)[0].startTime).getDate()
      : null;

    if (date !== previousDate) {
      accum.push([hour]);
    }

    if (date === previousDate) {
      accum[accum.length - 1].push(hour);
    }

    return accum;
  }, []);

  return (
    <div>
      {days.map((day) => {
        const key = `${day[0].number} - ${day[day.length - 1].number}`;
        const dayName = new Date(day[0].startTime).toDateString();

        return (
          <div key={key}>
            <h3>{dayName}</h3>
            {day.map((hour) => (
              <Hour key={`hour-${hour.number}`} {...hour} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const Loading = () => {
  return 'Loading...';
};

export default function Forecast(props) {
  const [forecastData, setForecastData] = useState(props.forecastData);

  useEffect(() => {
    fetch(PORTSMOUTH_HOURLY_URL)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      });
  }, []);

  return (
    <div>
      <h2>
        Hourly Forecast - Generated at{' '}
        {calculateForecastGeneratedAt(forecastData)}
      </h2>
      {forecastData ? <Days {...forecastData.properties} /> : <Loading />}
    </div>
  );
}
