// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";
import NavDropDown from "./NavDropDown";

const ClubRule = () => {
  return (
    <>
      <NavDropDown/>
      <FullDiv>
        <h1>
          General Rules for Membership of Clubs & Professional Bodies at TINT
        </h1>
        <h3>
          A student must abide by the following guidelines for membership of
          Clubs and/or Student Chapters/Branches of Professional Bodies at TINT:
        </h3>
        <ul>
          <li>
            Membership of a Club and /or Student Chapter / Branch of a
            Professional Body will be granted to an applicant only after their
            application is forwarded by the concerned Head of the Department.
          </li>
          <li>
            Applicants must have 75% attendance in both theory classes and
            laboratory sessions.
          </li>
          <li>
            The applicant must not have impinged upon him/herself any
            disciplinary action / complaint.
          </li>
          <li>
            No defaulter shall be considered eligible to hold membership of the
            Clubs and/or Professional Bodies.
          </li>
          <li>
            The applicant must responsibly ensure that their participation in
            the activities of the Clubs do not encroach on their academic
            performance.
          </li>
          <li>
            Mere submission of application does not guarantee the selection of
            an applicant.
          </li>
          <li>
            The selected members are expected to participate in the activities
            and attend the meetings of the concerned Clubs and Professional
            Bodies regularly.
          </li>
          <li>
            Members shall under no circumstances use club properties provided or
            made available to them for their private purposes and must not
            mishandle Club property.
          </li>
          <li>
            Members are expected to work responsibly and sincerely as well as
            develop a spirit of mutual respect and cooperation among themselves
            while organising events or participating in Club activities.
          </li>
        </ul>
        <h3>Regulations for Membership of Professional Bodies for Technical Education & Research</h3>
        <ul>
          <li>TINT is home to Student Chapters and Student Branches of the following Professional Bodies:</li>
          <ol>
            <li>ISTE (Indian Society for Technical Education)</li>
            <li>ACM (Association of Computing Machinery)</li>
            <li>IEEE (Institute of Electrical and Electronics Engineers)</li>
            <li>IEI (Institution of Engineers, India)</li>
          </ol>
          <li>Among these, membership of ISTE is mandatoryfor all engineering students.</li>
          <li>In addition, an engineering student has to take the membership of either the Student Chapter of ACM or the Student Branch of IEEE.</li>
          <li>Further, engineering students may also apply formembership of the student chapter of IEI.</li>
        </ul>
        <h3>Regulations for Enrolment in NSS & Sports
        </h3>
        <ul>
          <li>TINT has an active NSS Unit, and voluntary service under NSS is mandatory for all students.</li>
          <li>Exuberance is the Sports Clubof the College. Membership of this Club is optional; both members and non-members get an opportunity to participate in the Annual College Sports.</li>
        </ul>
        <h3>Regulations for Membership of Technical Clubs at TINT</h3>
        <ul>
          <li>TINT has 3 technical Clubs, namely:</li>
          <ol>
            <li>Genesis: The Official Science and Technology Club, TINT</li>
            <li>TINT Coding Club</li>
            <li>Google Developer Student Club (GDSC)</li>
          </ol>
          <li>Membership of any one of these three technical Clubs is mandatory for all engineering students. Students may choose to apply for membership of more than one technical Club.</li>
        </ul>
        <h3>Regulations for Membership of Clubs for Extracurricular Activities at TINT</h3>
        <ul>
          <li>TINT offers facilities of 6 Clubs for pursuing extra-curricular activities, namely:</li>
          <ol>
            <li>Hridmajhare- Club of Performing Arts</li>
            <li>TINT Photography Club</li>
            <li>TINT Talkies- The Film & Drama Club</li>
            <li>Aesthetica- TINT Art Club</li>
            <li>Litwits- TINT Literary Club</li>
            <li>TINT Hikers & Planeteers Club</li>
          </ol>
          <li>A student may avail of membership of any two of these Clubs. In case they are not selected in the Club of their choice after scrutiny, they shall get the opportunity to apply for membership of the other Club(s).</li>
        </ul>
      </FullDiv>
    </>
  );
};

export default ClubRule;

const FullDiv = styled.div`
  margin: 10px 150px 0px 150px;

  h1 {
    font-size: 50px;
    font-weight: 300;
  }

  h3{
    padding-top: 10px;
    padding-bottom: 10px;
    font-weight: 750;
    
  }
  ul{
    padding-left: 50px;
    line-height: 32px;
  }
  ol{
    padding-left: 50px;
    line-height: 25px;
  }
`;
