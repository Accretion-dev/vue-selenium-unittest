<template>
  <div style="background:#eee;padding-bottom: 20px">
    <Card :bordered="false">
      <div slot="title">
        <p style="height: 100%">
          <Button size="small" @click="open = !open">
            {{ open ? '-' : '+' }}
          </Button>
          {{ title }}:
          <test-button :name="name" :running="running"/>
        </p>
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
      running: false,
      open: true,
      body: null,
    }
  },
  watch: {
    open (value) {
      if (value) {
        this.body.style.display = ""
        this.$emit('fold', false)
      } else {
        this.body.style.display = 'none'
        this.$emit('fold', true)
      }
    }
  },
  mounted () {
    this.body = this.$el.querySelector('.ivu-card-body')
  }
}
</script>

<style scoped>
</style>
