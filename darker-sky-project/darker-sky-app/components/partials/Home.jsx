import { Island, logWarn } from '@hubspot/cms-components';

import Forecast from '../islands/Forecast.jsx?island';

import Layout from '../Layout.jsx';

function Home(props) {
  logWarn(props);

  return (
    <Layout>
      <h1>Darker Sky</h1>

      <Island
        module={Forecast}
        id="forecast-island"
        hydrateOn="load"
        forecastData={
          props.serverSideProps && props.serverSideProps.forecastData
        }
      />
    </Layout>
  );
}

export default Home;

// export const getServerSideProps = async () => {
//   const forecastData = await new Promise((resolve, reject) => {
//     let data = [];

//     https
//       .get(
//         {
//           hostname: 'api.weather.gov',
//           port: '443',
//           path: '/gridpoints/GYX/63,28/forecast/hourly',
//           method: 'GET',
//           headers: {
//             'User-Agent': 'bmatto@gmail.com',
//           },
//         },
//         (res) => {
//           res.on('data', (chunk) => {
//             data.push(chunk);
//           });

//           res.on('end', () => {
//             const parsedData = JSON.parse(Buffer.concat(data).toString());

//             resolve(parsedData);
//           });
//         },
//       )
//       .on('error', reject);
//   });

//   return {
//     forecastData,
//   };
// };
