/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import "./App.css";

const CLIENT_ID = "af08be84cb68c598a251";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam, "helo");

    if (codeParam && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("accessToken", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function getUserData() {
    try {
      const response = await fetch("http://localhost:4000/getUserData", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (!response.ok) {
        throw new Error("User data retrieval failed: " + response.status);
      }

      const data = await response.json();
      console.log(data, "test15");
      setUserData(data);
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  }

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }

  return (
    <>
      <h1 style={{ alignItems: "center" }}>AdeoDist-Task</h1>
      <div className="App">
        <header className="App-header">
          {localStorage.getItem("accessToken") ? (
            <>
              <h2>Successfully Authentication to Github</h2>
              <button
                className="github-button"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  setRerender(!rerender);
                }}
              >
                Log Out
              </button>
              <h3>Get user data</h3>
              <div className="button-container">
                <button onClick={getUserData}>Logged User Details</button>
                <button
                  onClick={() =>
                    (window.location.href = "https://github.com/trending")
                  }
                >
                  Github User Details
                </button>
              </div>

              {Object.keys(userData).length !== 0 ? (
                <>
                  <h4>Hi, {userData.login}</h4>
                  <img
                    width="100px"
                    height="100px"
                    src={userData.avatar_url}
                  ></img>
                  <a href={userData.html_url} style={{ color: "whitesmoke" }}>
                    Link to github page
                  </a>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <h3>GitHub OAuth 2.0 Authentication Using React</h3>
              <p>User not Login to Github</p>
              <button className="github-button" onClick={loginWithGithub}>
                <i className="fab fa-github"></i> Login
              </button>
            </>
          )}
        </header>
      </div>
    </>
  );
}

export default App;
