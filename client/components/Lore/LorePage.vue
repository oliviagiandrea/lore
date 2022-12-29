<!-- Default page that also displays lore -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateLoreForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Hobgoblin Lore!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete lore.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all lore
            <span v-if="$store.state.filter">
              containing '{{ $store.state.filter }}'
            </span>
          </h2>
        </div>
        <div class="right">
          <GetLoreForm
            ref="getLoreForm"
            value="title"
            placeholder="🔍 Search by title"
            button="🔄 Get lore"
          />
        </div>
      </header>
      <section
        v-if="$store.state.lore.length"
      >
        <LoreComponent
          v-for="lore in $store.state.lore"
          :key="lore.id"
          :lore="lore"
        />
      </section>
      <article
        v-else
      >
        <h3>No lore found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import LoreComponent from '@/components/Lore/LoreComponent.vue';
import CreateLoreForm from '@/components/Lore/CreateLoreForm.vue';
import GetLoreForm from '@/components/Lore/GetLoreForm.vue';

export default {
  name: 'LorePage',
  components: {LoreComponent, GetLoreForm, CreateLoreForm},
  mounted() {
    this.$refs.getLoreForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
