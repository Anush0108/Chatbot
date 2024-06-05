<template>
<div :class="{ user: message.user, bot: !message.user }">
    {{ message.text }}
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
  },
};
</script>

<style scoped>
.user {
  background-color: #eee;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.bot {
  background-color: #ddd;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
}
</style>