import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// FileUploadWithPreview
// chat.js (type="module")
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview/dist/index.js';


  const upload = new FileUploadWithPreview('upload-image',{
      multiple:true,
      maxFileCount:6
  });


//End FileUploadWithPreview
//CLIENT SEND DATA
document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('.chat .inner-body');
  if (body) body.scrollTop = body.scrollHeight;
});
const formSendData=document.querySelector(".chat .inner-form");
const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

if(formSendData){
    formSendData.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const content = e.target.elements.content.value;
        const rawFiles = upload.cachedFileArray || [];
        const images = await Promise.all(rawFiles.map(fileToBase64));
        if(content || images.length > 0){
            socket.emit("CLIENT_SEND_MESSAGE",{ content, images });
            e.target.elements.content.value="";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING","hidden");
        }
    })
}

//end CLIENT SEND DATA

//Server return message
socket.on("SERVER_RETURN_MESSAGE",(data)=>{
    const myId=document.querySelector("[my-id]").getAttribute("my-id");
    const body=document.querySelector(".chat .inner-body");
    const div=document.createElement("div");
    let htmlFullname="";
    let htmlContent="";
    let htmlImages="";
    if(myId==data.userId){
        div.classList.add("inner-outgoing");
    }
    else{
         div.classList.add("inner-coming");
         htmlFullname= `<div class="inner-name" >${data.fullName}</div> `;
    }
   

    if(data.content){
        htmlContent= `<div class="inner-content" >${data.content}</div>`
    };
    console.log("Ảnh này:----",data.images);
    if(data.images){
      htmlImages+=`<div class="inner-images">`;
      for(const image of data.images){
        htmlImages+=`<img src=${image}>`;
      };
      
      htmlImages+=`</div>`;
    }

    div.innerHTML=`
        ${htmlFullname}
        ${htmlContent}
        ${htmlImages}
     `   
    console.log(div);
     body.insertBefore(div, elementListTyping); 
     body.scrollTop = body.scrollHeight;
})
//Ham show typing
var timeOut;
const showTyping=()=>{
   socket.emit("CLIENT_SEND_TYPING","show");

        clearTimeout(timeOut);

        timeOut=setTimeout(()=>{
             socket.emit("CLIENT_SEND_TYPING","hidden");
        },3500);
}
//End Ham show typing




//End Server return message

//emoji-picker
//icon
const buttonIcon=document.querySelector(".button-icon");
const emojiPicker=document.querySelector('emoji-picker');
const tooltip = document.querySelector('.tooltip');
 if(buttonIcon){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
  };
 };


// đóng khi click ra ngoài
document.addEventListener('click', (e) => {
  const isClickInsideButton = buttonIcon.contains(e.target);
  const isClickInsideTooltip = tooltip.contains(e.target);
  if (!isClickInsideButton && !isClickInsideTooltip && tooltip.classList.contains('shown')) {
    tooltip.classList.remove('shown');
  }
});

// đóng khi nhấn Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && tooltip.classList.contains('shown')) {
    tooltip.classList.remove('shown');
  }
});

//end icon
 var timeOut;
if(emojiPicker){
    console.log("emoji:",emojiPicker)
    const inputChat=document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener('emoji-click', (event) => {
        
        const icon=event.detail.unicode;
        
        inputChat.value=inputChat.value + icon;
         const end=inputChat.value.length;
         inputChat.setSelectionRange(end,end);
         inputChat.focus();
      
      showTyping();
    });
    
    inputChat.addEventListener("keyup",()=>{
        showTyping();
    });
};


//end emoji-picker

//typing
const elementListTyping=document.querySelector(".chat .inner-body .inner-list-typing");
console.log(elementListTyping);
if(elementListTyping){
  const body = document.querySelector('.chat .inner-body');
   
    socket.on("SERVER_RETURN_TYPING",(data)=>{
       if(data.type=="show"){
        
        
         const existTyping=elementListTyping.querySelector(`[user-id="${data.userId}"]`);
         if(!existTyping){
             const boxTyping=document.createElement("div");
            boxTyping.classList.add("box-typing");
         boxTyping.setAttribute("user-id",data.userId);
         boxTyping.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots-wrap">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>`;
        elementListTyping.appendChild(boxTyping);
        body.scrollTop = body.scrollHeight;
         };

       }
       else{
         const boxTypingRemove=elementListTyping.querySelector(`[user-id="${data.userId}"]`);
         elementListTyping.removeChild(boxTypingRemove);
       }
});
};

//end typing


