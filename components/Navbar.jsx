// eslint-disable-next-line no-unused-vars
import React from 'react'
import styled from'styled-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Container>
      <div className='logo'>
        <img src="public/Logo1.png" alt="" />
      </div>
      <ul>
        <li>Home</li>
        <div className="club">
          <li className="dropdown" onClick={toggleDropdown}>
          Clubs
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="/clubRule" className='noUnderLine'>Rules for Membership</Link></li>
              <li><Link to="/ArtClub" className='noUnderLine'>TINT Art Club - AESTHETICA</Link></li>
              {/* <li>TINT Art Club - AESTHETICA</li> */}
              <li>TINT Literary Club - LITWITS</li>
              <li>TINT Photography Club</li>
              <li>TINT Film & Drama Club - TINT Talkies</li>
              <li>TINT Music Club - HRIDMAJHARE</li>
            </ul>
          )}
          </li>
          <div className="downarrow" onClick={toggleDropdown}></div>
        </div>
        <li>Dashboard</li>
        <li>Admin Portal</li>
        <li>Notice Board</li>
      </ul>
      <Button>Student Login</Button>
        {/* <div className='bar'></div> */}
      
    </Container>
  )
}

export default Navbar

const Container = styled.nav`

  width: 1600px;

  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: auto;

  .club{
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    
  }
  .downarrow{
    width: 8px;
    height: 4px;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid black;
  }
  .logo{
    align-items: center;
    img{
      width: 70%;

    }
  }
  ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /* align-items: center; */
    list-style: none;
    gap: 20px;

  }

  li{
    font-size: 18px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    &:hover{
      border-bottom: 2px solid black;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: 51px;
    background-color: #fff;
    border: 1px solid #ccc;
    list-style: none;
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: max-content;
    z-index: 1;

    text-decoration: none;
      color: black;

    .noUnderLine{
      text-decoration: none;
      color: black;
    }
  }

.dropdown-menu li {
  cursor: pointer;
}
`;

export const Button = styled.button`
  cursor: pointer;
  font-size: 18px;
  background-color: white;
  border-radius: 8px;
  font-weight: 500;
  padding: 8px;
  right: 10px;
  border: 2px solid gray;
  &:hover{
      /* font-weight: 700; */
      background-color: #f3f5fa;
      border: 2px solid black;
      /* transition: transform 2s ease-in-out; */
      /* color: white; */
    }
`;
