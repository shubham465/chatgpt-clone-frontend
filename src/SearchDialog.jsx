import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import "./SearchDialog.css"
import {domain} from './constant'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Variants from './Variants'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


function formatDateToShortMonthDay(timestampOrDate) {
  // Ensure we are working with a Date object
  const dateObj = timestampOrDate instanceof Date ? timestampOrDate : new Date(timestampOrDate);

  const options = {
    month: 'short', // 'short' gives "Nov"
    day: 'numeric'  // 'numeric' gives "6"
  };

  // Use Intl.DateTimeFormat for reliable and locale-aware formatting
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

function getMatchedChats(chats, phrase) {
  const matchedChats = [];

  chats.forEach(chat => {
    const matchedWords = [];

    chat.messages.forEach(msg => {
      const contentLower = msg.content.toLowerCase();
      const phraseLower = phrase.toLowerCase();

      // Find the start index of the phrase in the message
      const index = contentLower.indexOf(phraseLower);

      if (index !== -1) {
        // Get substring from the phrase till the end
        const substring = msg.content.slice(index);

        // Split into words and add to matchedWords
        matchedWords.push(...substring.split(/\s+/));
      }
    });

    if (matchedWords.length > 0) {
      matchedChats.push({
        id: chat._id,
        words: matchedWords.join(" "), // combine words into a string
        createdAt: chat.createdAt
      });
    }
  });

  return matchedChats;
}



export default function CustomizedDialogs({open, setOpen, token, setChat}) {
  const [query, setQuery] = React.useState('')
  const handleClose = () => {
    setOpen(false);
  };
  const [searchData, setSearchData] = React.useState([])

  const HandleChange = (e) => { 
    setQuery(e.target.value)
  }

  const HandleClick = async (id) => {
    try{
      const data = await fetch(domain + '/chat/' + id, {
    method: "GET", // Specify POST method
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`  
    }
    }).then(res=> res.json())
      setChat(data)
      handleClose()

    }
    catch(err){
      console.log("Could not fetch chat")
      throw new Error(err)
    }
  }

  React.useEffect(()=> {
  async function FilterData() {
  try{
  const data = await fetch(domain + `/chat/all/search?query=${query}`,  {
    method: "GET",
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}`  
    }
  }).then((res)=> res.json())
  setSearchData(getMatchedChats(data, query))
  }
  catch(err){
    console.log("Failed to fetch search data")
    throw new Error(err)
  }
  }
  FilterData()
  },[query])

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        className='container'
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <input placeholder='...Search chats' autoFocus value={query} onChange={HandleChange} style={{border: 'none', outline: 'none'}}/>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className='dialog-items'>
          {query == '' ? <Variants/>
          :
          searchData.map((item, index)=> (
            <div onClick={() => HandleClick(item.id)} className='dialog-item'>
              <span><ChatBubbleOutlineIcon/> {formatDateToShortMonthDay(item.createdAt)}</span>
              <span>{item.words}</span>
            </div>
          ))
          }
          </div>

        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
