import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import userPhoto from '../../assets/images/profile-user-photo-1.png';
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import './About.scss';

const AboutPage = () => {
    return (
        <div className="page page-about">
            <Header />
            <div className="container">
                <div className="main">
                    <section className='info'>
                        <div className='row'>
                            <div className="info__main col-md-6">
                                <h2>About</h2>
                                <p><strong>VITALKS</strong> is a social networking platform built using the MERN stack (<i>MongoDB, Express, React, Node</i>). The goal is to provide a space where users can discuss health-related topics, encouraging open conversations on health matters while ensuring privacy and anonymity for sensitive topics. The focus is on building a user-friendly, secure, and efficient network where users can share experiences, seek advice, and connect on health-related concerns.</p>
                            </div>
                            <div className="col-md-6">
                                <div className='info__img-container'>
                                    <img className="info__img" src="https://img.freepik.com/free-photo/mental-health-care-sketch-diagram_53876-123900.jpg?t=st=1732345431~exp=1732349031~hmac=d0891984a86093b6e4ee15d4966c0ee286fc139ce3ce42a2a93bf3fc5b1725d7&w=1480" alt="About VITALKS" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='info'>
                        <div className='row'>
                            <div className="col-md-6">
                                <div className='info__img-container'>
                                    <img className="info__img" src="https://img.freepik.com/free-photo/man-looking-through-glass-business-vision-blockchain-technology-digital-remix_53876-108524.jpg?t=st=1732346253~exp=1732349853~hmac=f44eac072ad02e27449d64b68db61e2954956b8b9772d8dc9a8d8be25a51a0b4&w=2000" alt="Vision" />
                                </div>
                            </div>
                            <div className="info__main col-md-6">
                                <h2>Vision</h2>
                                <p>At VITALKS, we envision a world where health-related conversations are open, supportive, and stigma-free. Our goal is to foster a global community where individuals can freely share their experiences, seek advice, and find solidarity in their health journeys—all in a secure and inclusive environment.</p>
                            </div>
                        </div>
                    </section>
                    <section className='info'>
                        <div className='row'>
                            <div className="info__main col-md-6">
                                <h2>Mission</h2>
                                <ul>
                                    <li>
                                        <strong>Empower Users</strong>
                                        <p>Provide a platform where individuals feel confident discussing health-related topics, knowing their privacy and anonymity are safeguarded.</p>
                                    </li>
                                    <li>
                                        <strong>Encourage Connection</strong>
                                        <p>Build a supportive community where users can connect, share, and learn from one another's experiences.</p>
                                    </li>
                                    <li>
                                        <strong>Promote Awareness</strong>
                                        <p>Facilitate access to valuable insights and resources, contributing to improved understanding and awareness of diverse health issues.</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <div className='info__img-container'>
                                    <img className="info__img" src="https://img.freepik.com/free-photo/close-up-team-health-workers_23-2149112524.jpg?t=st=1732346329~exp=1732349929~hmac=6289d979e37746fefa81f9fa883f52f4a54a22d61e00f0987fa114f44f9c27ac&w=2000" alt="Mission" />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='info'>
                        <div className='row'>
                            <div className="col-md-6">
                                <div className='info__img-container'>
                                    <img className="info__img" src="https://img.freepik.com/free-photo/mobile-notification-icons-man-woman-using-cell-phone_23-2147844554.jpg?t=st=1732345398~exp=1732348998~hmac=fdf31bba4289be62ca38b29a6cbd64d55bc1e49b30d11546a6fedb273e173834&w=2000" alt="Image 1" />
                                </div>
                            </div>
                            <div className="info__main col-md-6">
                                <h2>Core Features</h2>
                                <ul>
                                    <li>
                                        <strong>User Management</strong>
                                        <p>Users can register, log in, and create profiles. They can follow or add-friends with other users, fostering a social network experience.</p>
                                    </li>
                                    <li>
                                        <strong>Post and Interaction System</strong>
                                        <p>Users can publish posts as public, private, or anonymous. Posts can receive comments and replies to facilitate discussions, similar to a thread structure.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className='info'>
                        <h2 className="align-center">Meet the Team</h2>
                        <p className="align-center">Meet the faces behind VITALKS and learn about the passion and expertise that drive our platform. Our dedicated team is committed to creating a secure, inclusive space for meaningful health conversations, ensuring every user feels supported and empowered.</p>

                        <div className='info__team'>
                            <div className='info__team-item'>
                                <div className='item__img-container'>
                                    <img className="info__img" src="https://avatars.githubusercontent.com/u/12868514?v=4" alt="Tim Nguyen" />
                                </div>
                                <div className='item__main-container'>
                                    <h2>Tim Nguyen</h2>
                                    <strong>Full-stack UI/UX</strong>
                                    <p>A versatile developer specializing in database management, full-stack development, and crafting intuitive user interfaces.</p>
                                    <div className='item__socials'>
                                        <a href="https://www.linkedin.com/in/timcodex/"><FaLinkedin /></a>
                                        <a href="https://github.com/tiennguyenvan"><FaGithub /></a>
                                    </div>
                                </div>
                            </div>
                            <div className='info__team-item'>
                                <div className='item__img-container'>
                                    <img className="info__img" src="https://avatars.githubusercontent.com/u/162349005?v=4" alt="Diego Pinlac" />
                                </div>
                                <div className='item__main-container'>
                                    <h2>Diego Pinlac</h2>
                                    <strong>Full-stack UI/UX</strong>
                                    <p>A dynamic full-stack developer with a talent for in-depth research and creating innovative, user-centric designs that elevate the platform experience.</p>
                                    <div className='item__socials'>
                                        <a href="https://www.linkedin.com/in/diegopinlac/"><FaLinkedin /></a>
                                        <a href="https://github.com/TechSavvyCoder"><FaGithub /></a>
                                    </div>
                                </div>
                            </div>
                            <div className='info__team-item'>
                                <div className='item__img-container'>
                                    <img className="info__img" src="https://avatars.githubusercontent.com/u/52702252?v=4" alt="Yaolong Liu" />
                                </div>
                                <div className='item__main-container'>
                                    <h2>Yaolong Liu</h2>
                                    <strong>Front-end</strong>
                                    <p>A front-end expert who excels in data creation, testing, and documenting, ensuring a polished and user-friendly platform.</p>
                                    <div className='item__socials'>
                                        <a href="https://www.linkedin.com/in/yaolong-liu-67310486/"><FaLinkedin /></a>
                                        <a href="https://github.com/YaolongLiu"><FaGithub /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
 
export default AboutPage;