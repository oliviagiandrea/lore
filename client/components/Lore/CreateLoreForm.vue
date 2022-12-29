<!-- Form for creating lore (block style) -->

<script lang="ts">
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateLoreForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/lore',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Title', value: ''},
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create lore',
      refreshLore: true,
      callback: () => {
        const message = 'Successfully created lore!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
