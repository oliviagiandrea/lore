<!-- Reusable component representing a single lore and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article class="lore">
    <h1 class="title">
      {{ lore.title }}
    </h1>
    <textarea v-if="editing" class="content" :value="draft" @input="draft = $event.target.value" />
    <p v-else class="content">
      {{ lore.content }}
    </p>
    <p class="info">
      {{ lore.dateModified }} - @{{ lore.author }}
    </p>
    <div v-if="$store.state.username" class="actions">
      <button v-if="editing" @click="submitEdit">
        ✅ Save changes
      </button>
      <button v-if="editing" @click="stopEditing">
        🚫 Discard changes
      </button>
      <button v-if="!editing" @click="startEditing">
        ✏️ Edit
      </button>
      <button @click="deleteLore">
        🗑️ Delete
      </button>
    </div>
    <section class="alerts">
      <article v-for="(status, alert, index) in alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'LoreComponent',
  props: {
    // Data from the stored lore
    lore: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this lore is in edit mode
      draft: this.lore.content, // Potentially-new content for this lore
      alerts: {} // Displays success/error messages encountered during lore modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this lore.
       */
      this.editing = true; // Keeps track of if lore is being edited
      this.draft = this.lore.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this lore.
       */
      this.editing = false;
      this.draft = this.lore.content;
    },
    deleteLore() {
      /**
       * Deletes this lore.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted lore!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates lore to have the submitted draft content.
       */
      if (this.lore.content === this.draft) {
        const error = 'Error: Edited lore content should be different than current lore content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited lore!',
        body: JSON.stringify({ content: this.draft }),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the lore's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: { 'Content-Type': 'application/json' }
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/lore/${this.lore._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshLore');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.lore {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
</style>
