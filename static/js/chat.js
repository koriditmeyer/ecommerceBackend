const form = document.querySelector("#chatForm");
const input = document.querySelector("#inputMessage");
const messagesUl = document.querySelector("#messagesUl");
// @ts-ignore
let user;

// @ts-ignore
Swal.fire({
  title: "CHAT",
  input: 'text',
  text: "Insert your name:",
  inputValidator: (value) => {
    return !value && "Need to enter a name";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  document.querySelector("input")?.focus();
  StartChat();
});

function StartChat() {
  // @ts-ignore
  const socket = io({ // HANDSHAKE Need to configure inside of IO the server to wich to connect. Not necessary here as same device
    auth:{user}
  }
  )
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if(input){
      // @ts-ignore
      sendMessage(user, input.value);
      // @ts-ignore
      input.value=''
    }
  });

  function sendMessage(user, message) {
    socket.emit("ClientMessage", { user, message }); //Send message
  }

  socket.on("ServerMessages", (data) => {
    //Do something when receive message
    if (messagesUl) {
      messagesUl.innerHTML = ``;
      for (const { user, message } of data) {
        const li = document.createElement("li");
        li.innerHTML = `${user}:${message}`;
        messagesUl?.appendChild(li);
      }
    }
  });

  socket.on("newUser", (userName) => {
    // @ts-ignore
    Swal.fire({
      text: `${userName} is connected`,
      toast: 'true',
      position: 'top-right'
    })
  });
}
