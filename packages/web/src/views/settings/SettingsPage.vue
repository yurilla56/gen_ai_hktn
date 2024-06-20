<template>
  <div class="settings-page">
    <h1>Settings</h1>
    <div class="logo">
      <img src="../../assets/images/start-logo.svg" alt="bomboloo">
      <span>bomboloo</span>
    </div>
    <div class="form">
      <label for="name">Your name</label>
      <input type="text" id="name" placeholder="Enter your name">

      <label for="gender">Gender</label>
      <select id="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label for="age">Age</label>
      <input type="number" id="age" placeholder="Enter your age">

      <label for="location">Location</label>
      <input type="text" id="location" placeholder="USA, Chicago">

      <label for="language">Language</label>
      <select id="language">
        <option value="english">English</option>
        <option value="spanish">Spanish</option>
      </select>
    </div>
    <button class="lets-go">Let's Go</button>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage'
}
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form label {
  margin: 10px 0 5px;
}

.form input, .form select {
  padding: 10px;
  margin-bottom: 20px;
  width: 200px;
}

.lets-go {
  background-color: purple;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>