import axios from "axios";

export const get_url = (url: string) => { 
  return 'https://dulce.triab.site/api'+url; 
}

export const getData = async (url:string) => {
    try {
      const response = await axios.get(url, {
        timeout: 10000,  // Set a timeout to avoid indefinite waiting for a response
      });
      return {
        data:response.data 
      } 
    } catch ( error:any ) {
        let title = "";
        let message = ""; 
        if (!error.response) {
          // No response from the server - either no internet or server is unreachable
          if (error.message.includes('Network Error')) {
              // Likely due to no internet connection
              title = 'Connection Error'
              message = 'It seems there is no internet connection.'
          } else if (error.code === 'ECONNABORTED') {
              // Request timed out (server did not respond in time)
              title = 'Connection Error'
              message = 'The server took too long to respond, please check if you have a stable internet connection'
          } else {
              title = 'Unknown Error'
              message = 'Something didn\'t go right'
          }
        } else {
          // The server responded but with an error status code
          const statusCode = error.response.status;
          if (statusCode === 500) {
              title = 'Server Error'
              message = 'There was a problem with the server.'
          } else {
              title = 'Request Error'
              message = `Error: ${statusCode}`
          }
        }
        return {
          error:{
            title:title,
            message:message 
          }
        }
    }
};


export const postData = async (url: string, payload: any, token?: string) => {
  try {
    const response = await axios.post(url, payload, {
      timeout: 10000,  // Set a timeout to avoid indefinite waiting for a response
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    
    return {
      data: response.data
    };

  } catch (error: any) {
    let title = "";
    let message = ""; 

    
    console.log(JSON.stringify(error.response, null, 4));

    if (!error.response) {
      // No response from the server - either no internet or server is unreachable
      if (error.message.includes('Network Error')) {
        title = 'Connection Error';
        message = 'It seems there is no internet connection.';
      } else if (error.code === 'ECONNABORTED') {
        // Request timed out (server did not respond in time)
        title = 'Connection Error';
        message = 'The server took too long to respond, please check if you have a stable internet connection';
      } else {
        title = 'Unknown Error';
        message = 'Something didn\'t go right';
      }
    } else {
      // The server responded but with an error status code
      const statusCode = error.response.status;
      if (statusCode === 500) {
        title = 'Server Error';
        message = 'There was a problem with the server.';
      } else {
        title = 'Request Error';
        message = `Error: ${statusCode}`;
      }
    }

    return {
      error: {
        title: title,
        message: message
      }
    };
  }
};

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => degree * (Math.PI / 180);

  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKm = R * c;

  return distanceInKm < 1
    ? Number((distanceInKm * 1000).toFixed(0)) / 1000  // Return distance as a decimal in km (e.g., 0.5 for 500m)
    : Math.round(distanceInKm);   
}
  