// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const NavDropDown = () => {
  return (
    <Container>
      <Link to="/BackHome" className="noUnderLine">
        <div className="svg">
          <FaChevronLeft/>
        </div>
        
        <h3>Back</h3>
      </Link>
    </Container>
  )
}

export default NavDropDown

const Container = styled.div`

  background-color: #c8c8c8;
  height: 50px;
  align-items: center;

  .noUnderLine{
    text-decoration: none;
    color: black;
    display: flex;
    align-items: center;
    gap: 10px;
    /* top: 25px; */
    padding-top: 8px;
    margin-left: 150px;

    .svg{
      padding-top: 5px;
    }

    h3{
      font-size: 25px;
    }
  }
`;
