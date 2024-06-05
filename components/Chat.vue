<template>
  <div class="chat-container">
    <div>
    <div class="message-container">
      <div v-for="message in messages" :key="message.actor" class="message-item message-bubble" :class="{ 'user-message': message.actor === 'Human', 'ai-message': message.actor === 'AI' }">
        {{ message.message }}
      </div>
    </div>

    <form @submit.prevent="submitMessage">
      <input @keypress.enter.exact.prevent="submitMessage" class="chat-input" type="text" placeholder="Type your message..." v-model="message" />
      <button @click.prevent="submitMessage" type="submit" class="send-button">Send</button>
    </form>
  </div>
  </div>
 

    
</template>

<script setup lang="ts">

  const message = ref("");
  const messages = ref([{
    actor:'assistant',
    message:'Hello,how can I help you?'
  },
  
  ]);
  
const submitMessage = async()=>{
  if(message.value=="") return;

  messages.value.push({actor:'Human',message:message.value});
  message.value="";

  console.log("Sending messages:", messages.value);
  
  const req = await fetch(`/api/gpt3`, {
    body: JSON.stringify(messages.value.slice(1)),
    method: 'post',
  });
  
  if(req.status == 200){
    const response = await req.json();
    messages.value.push({actor:'AI',message:response.message});
    message.value = '';
  }

 




}

</script>

<style scoped>
html, body {
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
  height: 100vh; /* Set height to 100% viewport height */
  font-family: sans-serif; /* Choose your preferred font family */
}

.chat-container {
  display:block;
  flex-direction: column;
  height: 100%; /* Inherit full height from body */
}

.message-container {
  height: 400px; /* Adjust height as needed */
  overflow-y: scroll;
  padding: 10px; /* Add padding for better visual separation */
}

.message-item {
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 5px;
}
.message-bubble {
  padding: 10px 15px;
  border-radius: 10px; /* Adjust for desired roundness */
  margin-bottom: 5px;
  background-color: #fff; /* Default white background */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  display: inline-block; /* Allow text wrapping */
  position: relative;
}
.user-message {
  background-color: #f9f9f9;
  float: right;
  clear: both; /* Clear float for next message */
}

.ai-message {
  background-color: #e0e0e0;
  float: left;
  clear: both; /* Clear float for next message */
}

.send-button {
  position: absolute; /* Position the button at the bottom */
  right: 30px; /* Adjust right margin as needed */
  bottom: 10px; /* Adjust bottom margin as needed */
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 50px; /* Round corners */
  cursor: pointer;
  background-color: #4caf50; /* Default color */
  color: white;
  transition: background-color 0.3s ease-in-out; /* Hover effect transition */
}

.send-button:hover {
  background-color: #45a049; /* Hover color */
}
.chat-input{
  display: flex; /* Allow for optional icon placement */
  align-items: center; /* Vertically center text within input */
  width: 450px; /* Take up full width of container */
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  outline: none; /* Remove default outline on focus */
  border-radius: 25px;
  background-color: #f9f9f9; /* Light background color */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>