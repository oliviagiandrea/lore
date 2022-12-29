import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various components.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // title string to filter shown lore by (null = show all)
    lore: [], // All lore created in the app
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored lore filter to the specified one.
       * @param filter - Username of the user to filter lore by
       */
      state.filter = filter;
    },
    updateLore(state, lore) {
      /**
       * Update the stored lore to the provided lore.
       * @param lore - Lore to store
       */
      state.lore = lore;
    },
    async refreshLore(state) {
      /**
       * Request the server for the currently available lore.
       */
      const url = state.filter ? `/api/users/${state.filter}/lore` : '/api/lore';
      const res = await fetch(url).then(async r => r.json());
      state.lore = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
