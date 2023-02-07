import { useState, useEffect } from 'react';
import {
  useIsServerRender,
  usePageUrl,
  useBaseName,
} from '@hubspot/cms-components';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

// Get this from the "partialName" added to the render context

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

const Home = () => {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    fetch(PORTSMOUTH_HOURLY_URL)
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
      });
  }, []);

  return (
    <div>
      <Link to="/test">Test</Link>

      <div>
        <h2>
          Hourly Forecast - Generated at{' '}
          {calculateForecastGeneratedAt(forecastData)}
        </h2>
        {forecastData ? <Days {...forecastData.properties} /> : <Loading />}
      </div>
    </div>
  );
};

const Test = () => {
  return (
    <div>
      <Link to="/">Home</Link>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};

export default function Forecast() {
  const isServerRender = useIsServerRender();
  const pageUrl = usePageUrl();
  const baseName = useBaseName();
  let router;

  console.log('in Forecast', baseName);
  console.log(pageUrl.pathname);

  if (isServerRender) {
    router = (
      <StaticRouter basename={baseName} location={pageUrl.pathname}>
        <App />
      </StaticRouter>
    );
  } else {
    router = (
      <BrowserRouter basename={baseName}>
        <App />
      </BrowserRouter>
    );
  }

  return router;
}
