// eslint-disable-next-line no-unused-vars
import React from 'react'

import ImageSlider from './ImageSlider/ImageSlider';
import styled from 'styled-components';
const Hero = () => {

    const images = [
        'hero3.jpg',
        'hero.jpg',
        'hero2.jpg',
        // Add more image URLs as needed
      ];
  return (
    <Container>
        
      <ImageSlider images={ images }/>
      <div className="paragraph">
        <img src="/dp.jpg" alt="" className='dp'/>
        <h2>Satyam Roychowdhury</h2>
        <h3>Founder & Managing Director,Techno India Group Chancellor, <br></br>Sister Nivedita University</h3>

        <p>Techno International New Town is a dynamic institution with a major focus on reaching excellence in research oriented education.  We have tried to meet every challenge with sustained efforts in strengthening our academic curriculum and course offerings, and maintaining our core mission and values at the same time. TINT as a proud associate of TIG will continue to evolve with the requirements of the time and will learn & adapt as we move on. Given our resources and our commitment we strive for a perfect today and a better hereafter.  Please join us to be the best in everything we strive for.<br></br>Best Wishes.</p>
        {/* <h3>TINT At A Glance</h3>
        <p>Techno International New Town (Formerly known as Techno India College of Technology) is a promising college under the aegis of Techno India Group with a vision of delivering quality education in the field of B. TECH (ECE, AEIE, CSE, IT, CSBS, IoT, Data Science, CE, ME, EE), MTECH(EE) and MCA.</p> */}
      </div>
    </Container>
  )
}

export default Hero

const Container = styled.div`
padding-top: 20px;
    margin: auto;
    width: 1600px;
    display: flex;
    /* flex-wrap: wrap; */
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    
    .paragraph{
        width: 70%;
        padding-left: 30px;
        text-align: justify;
        
        .dp{
            width: 20%;
        }

        h3{
          padding-bottom: 10px;
          font-size: 20px;
          font-weight: 300;
        }

        p{
          font-size: 18px;
          font-weight: 300;
        }
    }
`
