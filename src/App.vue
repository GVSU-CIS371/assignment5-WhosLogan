<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <button v-if="!beverageStore.user" @click="signInWithGoogle()">Sign in with Google</button>
    <div v-else>
      <p>Welcome, {{ beverageStore.user.displayName }}</p>
      <button @click="logout()">Sign out</button>
    </div>
    <p v-if="beverageStore.usrMessage">{{ beverageStore.usrMessage }}</p>
    <input type="text" placeholder="Beverage Name" v-model="beverageStore.currentName" />
    <button :disabled="!beverageStore.user" @click="makeBeverage()">🍺 Make Beverage</button>
  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
  <ul>
    <li>
      <template v-for="b in beverageStore.beverages" :key="b.id">
        <label>
          <input
              type="radio"
              name="beverages"
              :id="`r${b.id}`"
              :value="b.id"
              v-model="beverageStore.selectedPreset"
              @change="beverageStore.showBeverage(b.id)"
          />
          {{ b.name }}
        </label>
      </template>
    </li>
  </ul>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import {onMounted} from "vue";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const beverageStore = useBeverageStore();

onMounted(async () => {
  await beverageStore.init();

  onAuthStateChanged(auth, (u) => {
    beverageStore.setUser(u);
  })
});

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    beverageStore.setUser(user);
  } catch (error) {
    beverageStore.usrMessage = "Unable to sign you in with Google.";
  }
}

async function logout() {
  await signOut(auth);
  beverageStore.setDefaults();
  beverageStore.usrMessage = "Signed out successfully.";
}

async function makeBeverage() {
  beverageStore.usrMessage = await beverageStore.makeBeverage();
}
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>
