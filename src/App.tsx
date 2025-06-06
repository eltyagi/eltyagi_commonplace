import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import  AboutMe from './components/about-me/AboutMe'
import Contact from './components/contact/Contact'
import LandingPage from './components/landing-page/LandingPage'
import Thoughts from './components/thoughts/Thoughts'
import Meditations from './components/meditations/Meditations'
import Navigation from './components/navigation/Navigation'


function App() {
  return (
    <>
     <div className="App">
     <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thoughts" element={<Thoughts />} />
          <Route path="/meditations" element={<Meditations />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
      </div> 

      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap" rel="stylesheet"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet"></link>
    </>
  )
}

export default App
