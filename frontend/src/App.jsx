import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Settings from "./components/Settings.jsx";
import {MyContext} from "./MyContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    showSettings, setShowSettings
  }; 

  return (
    <ThemeProvider>
      <div className='app'>
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
          <Settings 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
          />
        </MyContext.Provider>
      </div>
    </ThemeProvider>
  )
}

export default App