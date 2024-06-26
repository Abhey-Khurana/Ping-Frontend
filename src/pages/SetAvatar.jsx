import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loader from "../assets/loader.gif";
import axios from 'axios';
import { Buffer } from 'buffer';
import { nanoid } from 'nanoid';
import { setAvatarRoute } from "../utils/apiRoutes.js"


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

function SetAvatar() {

  let axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_DB_URL
  });


  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);


  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };


  async function setProfilePicture(e) {

    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {

      const user = await JSON.parse(localStorage.getItem("chat-app-user"));

      const { data } = await axiosInstance.post(`${setAvatarRoute}/${user._id}`, {
        avatarImage: avatars[selectedAvatar]
      });
      // console.log(data.isSet);

      

      if (data.isSet) {
        setSelectedAvatar(true);
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;

        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/")
      }
      else {
        toast.error("Avatar not set. Please try again.")
      }
    }
  };

  useEffect(() => {
    ; (async function () {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    })()
  }, []);
  useEffect(() => {
    ; (async function () {
      const api = "https://api.multiavatar.com/";
      let data = [];

      for (let i = 0; i < 4; i++) {
        let image = await axios.get(`${api}${Math.floor(Math.random() * 1000) + 1}`);

        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      // console.log("AVATARS", data);
      setAvatars(data);
      setIsLoading(false);

    }
    )()
  }, []);


  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={avatar}
                  className={`avatar ${selectedAvatar === index ? "selected" : ""
                    } `}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"

                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={(e) => setProfilePicture(e)} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}




export default SetAvatar