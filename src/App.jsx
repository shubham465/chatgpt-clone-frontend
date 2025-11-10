import { useState, useRef, useEffect } from "react";
import "./App.css";
import { domain } from "./constant";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Sidebar from './Sidebar'
import {useNavigate} from "react-router-dom"

export default function App() {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token")
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false)
  const [chat, setChat] = useState({})
  const [chats, setChats] = useState([])
  const navigate = useNavigate()
 const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const FetchChatResponse = async (newMessage) => {
    setLoading(true)
    const res = await fetch(domain + "/chat", {
    method: "POST", // Specify POST method
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`  
    },
    body: JSON.stringify({
      message: newMessage// Your data payload
    })
  }).then((res)=> res.json())
    setLoading(false)
    return res
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    if(isLoggedIn && chat._id){
      await SaveNewChatInDatabase(newMessage)
    }
    setMessages([...messages, newMessage]);
    setInput("");
    // Simulated response for UI preview only
    let response = await FetchChatResponse(input);
    setMessages((prev) => [
      ...prev, // remove typing indicator
      { role: "assistant", content: response },
    ]);
    if(isLoggedIn && chat._id){
      await SaveNewChatInDatabase({ role: "assistant", content: response })
    }
  };

  async function  SaveNewChatInDatabase(message) {
    const data = await fetch(domain + '/chat/new/' + chat._id, {
    method: "POST", // Specify POST method
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`  
    },
    body: JSON.stringify({
      message: message// Your data payload
    })
    }).then((res)=> res.json()) 
  }

  const HandleSignout = () => {
    localStorage.removeItem('token')
    window.location.replace(window.location.href);
  } 

  useEffect(()=> {
    if(chat && chat._id){
      setMessages([...chat.messages])
    }
    else if(chat && chat.new === true ){
    async function CreateChat() {
    const chat = await fetch(domain + '/chat/new' ,{
    method: "POST", // Specify POST method
    headers: {
      "Content-Type": "applicat ion/json", 
      "Authorization": `Bearer ${token}`  
    }}).then((res)=> res.json())
    setChat(chat)
    }
    CreateChat()
    }
  }, [chat])

  return (
    <div className="app-container" style={{display: 'flex'}}>
    {isLoggedIn ? <Sidebar chat={chat} chats={chats} isMobile={isMobile} setChats={setChats} setChat={setChat} token={token}/> : <></> }
    <div className="chat-container" style={isMobile && isLoggedIn ? { width : '75vw'} : isLoggedIn ? {width: '85vw'} : {width: '100vw'}}>
      <div className="chat-header">💬 ChatGPT Clone
        <div className="auth">
        {!isLoggedIn &&
        (
        <>
        <button onClick={()=> navigate('/signin')}>Login</button>
        <button onClick={()=> navigate('/signup')}>Signup for free</button>
        </>
        )
        }
        {isLoggedIn && 
        <button onClick={HandleSignout}>Signout</button>
        }
        </div>
      </div>

      <div className="chat-box">
        {messages.length == 0 && <h3>Hello how can I help you today ?</h3>}
        {messages && messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.role === "user" ? "user-message" : "assistant-message"
            }`}
          >
            <p className="message-content" style={{whiteSpace: 'pre-wrap'}}>{msg?.content.includes("```") 
            ? msg.content.split('```').map((str, index)=> (
              index%2 == 1 ? <SyntaxHighlighter style={docco}>
                {str}
              </SyntaxHighlighter>
              :
              <>{str}</>
            ))
            : msg.content}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type={loading ? "" : "submit"} style={loading ? {opacity: 0.3, pointerEvents: 'none'} : {}}>Send</button>
      </form>
    </div>
    </div>

  );
}
