import React,{useState, useEffect} from "react";
import styled from "styled-components";
import robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchdata() {
      setUserName(
        await JSON.parse(localStorage.getItem("chat-app-user")).username
      );
    }
    fetchdata();
  }, []);
  return (
    <Container>
      <img src={robot} alt="Robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start Messsaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
`;
