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


export const postData = async (url: string, payload: any) => {
    try {
      const response = await axios.post(url, payload, {
        timeout: 10000,  // Set a timeout to avoid indefinite waiting for a response
      });
      
      return {
        data: response.data
      };
  
    } catch (error: any) {
      let title = "";
      let message = ""; 
  
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
  