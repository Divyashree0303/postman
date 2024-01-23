"use client"
import { useState } from 'react';
import "./styles.css";

export default function Home(){

  const [requestType, setRequestType] = useState('GET');
  const [url, setUrl] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [params, setParams] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [response, setResponse] = useState({ status: null, data: null });
  const [authType, setAuthType] = useState('None');
  const [authCredentials, setAuthCredentials] = useState({ username: '', password: '' });
  const [accessToken, setAccessToken] = useState('');

  const handleSendRequest = async () => {
    try {
      let urlWithParams = new URL(url);

      params.forEach(([key, value]) => {
        if (!urlWithParams.searchParams.has(key)) {
          urlWithParams.searchParams.append(key, value);
        }
      });

      const requestOptions = {
        method: requestType,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers),
        },
        body: (requestType !== 'GET' && requestType !== 'DELETE') ? JSON.stringify(JSON.parse(requestBody)) : undefined,
      };

      if (authType === 'Basic') {
        const base64Credentials = btoa(`${authCredentials.username}:${authCredentials.password}`);
        requestOptions.headers['Authorization'] = `Basic ${base64Credentials}`;
      } else if (authType === 'OAuth2.0') {
        requestOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const res = await fetch(urlWithParams.toString(), requestOptions);

      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error) {
      console.error('Error sending request:', error);
      setResponse({ status: null, data: error.message });
    }
  };


  const handleAuthTypeChange = (e) => {
    setAuthType(e.target.value);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, ['', '']]);
  };

  const handleRemoveHeader = (index) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    setHeaders(updatedHeaders);
  };

  const handleRemoveParam = (index) => {
    const updatedParams = [...params];
    updatedParams.splice(index, 1);
    setParams(updatedParams);
  };

  const handleAddParam = () => {
    setParams([...params, ['', '']]);
  };

  const handleParamKeyChange = (index, key) => {
    const updatedParams = [...params];
    updatedParams[index][0] = key;
    setParams(updatedParams);
  };

  const handleParamValueChange = (index, value) => {
    const updatedParams = [...params];
    updatedParams[index][1] = value;
    setParams(updatedParams);
  };

  

  const handleHeaderKeyChange = (index, key) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][0] = key;
    setHeaders(updatedHeaders);
  };

  const handleHeaderValueChange = (index, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][1] = value;
    setHeaders(updatedHeaders);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
  };




  return (
      <div className='container'>
      <form className='form'>
        <div className='row'>
          <label className='label overflow' style={{width:"20%"}}>

            
            <select className='select' value={requestType} onChange={(e) => setRequestType(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PATCH">PATCH</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </label>
          <br />

          <label className='label overflow' style={{width:"80%"}}>
            
            <input
              className='input'
              type="text"
              placeholder="Enter API URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </div>

        <div className='authContainer'>
          <label className='label'>
            Authentication Type:
            <select className='select' value={authType} onChange={handleAuthTypeChange}>
              <option value='None'>None</option>
              <option value='Basic'>Basic Auth</option>
              <option value='OAuth2.0'>OAuth 2.0</option>
            </select>
          </label>

          <br/>

          {authType === 'Basic' && (
            <div className='basicAuthContainer' >
              <label className='label' style={{width:"50%"}}>
                Username:
                <input
                  className='input'
                  type='text'
                  value={authCredentials.username}
                  onChange={(e) => setAuthCredentials({ ...authCredentials, username: e.target.value })}
                />
              </label>
              <label className='label' style={{width:"50%"}}>
                Password:
                <input
                  className='input'
                  type='password'
                  value={authCredentials.password}
                  onChange={(e) => setAuthCredentials({ ...authCredentials, password: e.target.value })}
                />
              </label>
            </div>
          )}

          <br/>

          {authType === 'OAuth2.0' && (
            <div className='oauthContainer'>
              <label className='label'>
                Access Token:
                <input
                  className='input'
                  type='text'
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
         
          {(requestType !== 'GET' && requestType !== 'DELETE')&& (
            <div className='bodyContainer'>
              <label className='label'>
                Body:
                <textarea
                  className='textarea'
                  placeholder="Enter request body (JSON)"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                />
              </label>
              <br />
            </div>)}

    

          <br/>

          {params.length > 0 && (
          <div className='headerContainer'>
            <label className='label'>
              Query Parameters:
              {params.map((param, index) => (
                <div key={index} className='headerRow'>
                  <input
                    className='input'
                    type="text"
                    placeholder="Key"
                    value={param[0]}
                    onChange={(e) => handleParamKeyChange(index, e.target.value)}
                  />
                  <input
                    className='input'
                    type="text"
                    placeholder="Value"
                    value={param[1]}
                    onChange={(e) => handleParamValueChange(index, e.target.value)}
                  />
                  <button className='removeButton' type="button" onClick={() => handleRemoveParam(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </label>
          </div>
        )}

        <button className='addButton' type="button" onClick={handleAddParam}>
          Add Query Parameter
        </button>

        <br/>
          
          {headers.length > 0 && (
           <div className='headerContainer'> 
          
            <label className='label'>
              Headers:
              {headers.map((header, index) => (
                <div key={index} className='headerRow'>
                  <input
                    className='input'
                    type="text"
                    placeholder="Key"
                    value={header[0]}
                    onChange={(e) => handleHeaderKeyChange(index, e.target.value)}
                  />
                  <input
                    className='input'
                    type="text"
                    placeholder="Value"
                    value={header[1]}
                    onChange={(e) => handleHeaderValueChange(index, e.target.value)}
                  />
                  <button className='removeButton' type="button" onClick={() => handleRemoveHeader(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </label>
          </div>)}

        <button className='addButton' type="button" onClick={handleAddHeader}>
          Add Header
        </button>
          
          <br />
          <button className='sendButton' type="button" onClick={handleSendRequest}>
            Send Request
          </button>
        </form>
          
        <div className='responseContainer'>
          <strong>Response:</strong>
          <div className='responseData'>
            <div>Status Code: {response.status}</div>
            <pre className='wordWrap'>{JSON.stringify(response.data, null, 2)}</pre>
          </div>
        </div>

        <button className='SignOutButton' onClick={handleSignOut}>Sign Out</button>
      </div>
  );}

