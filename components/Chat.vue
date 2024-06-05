<template>
  <div class="chat-container">
    <div class="message-container">
      <div
        v-for="message in messages"
        :key="message.content"
        class="message-item message-bubble"
        :class="{
          'user-message': message.role === 'user',
          'ai-message': message.role === 'assistant',
        }"
      >
        {{ message.content }}
      </div>
    </div>

    <form>
      <input
        @keypress.enter.exact.prevent="submitMessage"
        class="chat-input"
        type="text"
        placeholder="Type your message..."
        v-model="message"
      />
      <button @click.prevent="submitMessage" type="submit" class="send-button">
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">


const message = ref("");
const messages = ref([
  { role: "assistant", content: "Hello, how can I help you?" },
]);

const submitMessage = async () => {
  if (message.value === "") return;

  messages.value.push({ role: "user", content: message.value });
  message.value = "";

  console.log("Sending messages:", messages.value);

  const req = await fetch("/api/gpt3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages.value),
  });

  if (req.status === 200) {
    const response = await req.json();
    messages.value.push(response.message);
  } else {
    const errorResponse = await req.json();
    console.error("Error response from API:", errorResponse);
    messages.value.push({
      role: "assistant",
      content: `Error: ${errorResponse.message}`,
    });
  }
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: sans-serif;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message-container {
  height: 400px;
  overflow-y: scroll;
  padding: 10px;
}

.message-item {
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 5px;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-block;
}

.user-message {
  background-color: #f9f9f9;
  float: right;
  clear: both;
}

.ai-message {
  background-color: #e0e0e0;
  float: left;
  clear: both;
}

.send-button {
  position: absolute;
  right: 30px;
  bottom: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease-in-out;
}

.send-button:hover {
  background-color: #45a049;
}

.chat-input {
  width: calc(100% - 20px);
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  outline: none;
  border-radius: 25px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>