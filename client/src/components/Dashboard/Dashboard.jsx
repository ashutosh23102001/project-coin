import React from 'react'
import './Dashboard.css'
import Right_ad from '../side-ad/Right_ad';
import Left_ad from '../side-ad/Left_ad';
import Home from './Home';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';


const Dashboard = () => {
  return (
    <div>

       <Navbar/> 
        <Right_ad/> 
        <Home/>
        <Footer/>
        <Left_ad/>
        
         
    </div>
  )
}

export default Dashboard