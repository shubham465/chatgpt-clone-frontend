import LogoVariant1  from "./LogoVarient"
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import "./Sidebar.css"
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { domain } from "./constant";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchDialog from './SearchDialog'

const Sidebar = ({chat, setChat, token, chats, setChats}) => {
   
   const [hover, setHover] = useState(null);
   const [open, setOpen] = useState(false)
   
   const HandleClick = ()=> {
      setChat({new: true})
   }

   const HandleDelete = async (id) => {
      try{
      const data = await fetch(domain + "/chat/delete/" + id, {
      method: "DELETE", // Specify POST method
      headers: {
         "Content-Type": "application/json", 
         "Authorization": `Bearer ${token}`  
      }
      }).then((res)=> res.json())
      FetchAllChats()
      }
      catch(err){
         throw new Error(err)
      }
   }

   async function FetchAllChats () {
      try{
      const data = await fetch(domain + "/chat/all", {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`  
      }
      }).then(res => res.json());
         setChats(()=> data)

         if(data.length > 0){
            setChat(data[0])
         }
         else if(data.length === 0){
            setChat({new: true})
         }
      }
      catch(err){
         throw new Error(err)
      }

   }

   useEffect(()=> {
      FetchAllChats()
   },[])

   return (
            <div className="Container" style={{width: '15vw', padding: '5px'}}>
                <div className="sidebar-list-container">
                   <LogoVariant1 width={25} height={25}/>
                   <div className="list-container">
                     <div className="list-item btn" onClick={HandleClick} >
                        <TextsmsOutlinedIcon />
                        <span>New Chat</span>
                     </div>
                     <div className="list-item btn" onClick={()=> setOpen(true)} >
                        <SearchIcon />
                        <span>Search chats</span>
                     </div>
                   </div>

                   <div className="list-container">
                     chats
                     {chats.length > 0 && chats.map((nchat, index)=> (
                     <div key={index} className="list-item btn icon-button" style={chat._id === nchat._id ? {backgroundColor:"#979aa1f4"} : {} } onClick={() => {
                        setChat(nchat)}
                        }
                        onMouseEnter={() => setHover(nchat._id)}
                        onMouseLeave={() => setHover(null)}
                        >
                           <span>{nchat.messages[0]?.content ?? 'New Chat'}</span>
                           <span onClick={()=> {HandleDelete(nchat._id)}}>{(hover === nchat._id || chat._id === nchat._id) && <DeleteIcon/>}</span>
                     </div>
                     ))}
                   </div>
                </div>
                <SearchDialog open={open} setOpen={setOpen} token={token} setChat={setChat}/>
            </div>
    )
}

export default Sidebar