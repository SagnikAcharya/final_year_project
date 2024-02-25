// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";
import NavDropDown from "./NavDropDown";
const ArtClub = () => {
  return (
    <>
      <NavDropDown />
      <Container>
        <h1>TINT Art Club - AESTHETICA</h1>
        <SecContainer>
          <div className="left">
            <h3>notice</h3>
          </div>
          <div className="right">
            <h3>notice</h3>
          </div>
        </SecContainer>
      </Container>
    </>
  );
};

export default ArtClub;

const Container = styled.div`
  margin: 0pc 150px 0px 150px;

  h1{
    text-align: center;
    font-size: 55px;
    font-weight: 600;
  }
`;

const SecContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
