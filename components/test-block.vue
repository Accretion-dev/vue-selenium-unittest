<template>
  <div style="background:#eee;padding-bottom: 20px">
    <Card :bordered="false">
      <div slot="title">
        <p> {{ title }}: <test-button :name="name" :running="running"/> </p>
      </div>
      <slot> </slot>
    </Card>
  </div>
</template>

<script>
import testButton from './test-button.vue'
export default {
  name: 'test-block',
  components: {testButton},
  props: {
    name: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      running: false
    }
  }
}
</script>

<style scoped>
</style>
