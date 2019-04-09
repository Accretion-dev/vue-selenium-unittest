<template>
  <div style="background:#eee;padding: 20px">
    <Card :bordered="false">
      <div slot="title">
        <p> {{ title }}: <test-button :name="name" :running="running"/> </p>
        <p>
          <template v-if="running">
            <clip-loader :loading="true" color="green" size="20px" style="float: left;"/>
            &nbsp;&nbsp;&nbsp;
          </template>
          <span class='selenium-comment' ref='comment'/>
          <span class='selenium-key' ref='key'/>
        </p>
      </div>
      <slot> </slot>
    </Card>
  </div>
</template>

<script>
import testButton from './test-button.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
export default {
  name: 'test-block',
  components: {testButton, ClipLoader},
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
    }
  },
  mounted () {
    const MutationObserverConfig={
      childList: true,
      subtree: true,
      characterData: true
    }
    this.mo = new MutationObserver((mutations) => {
      if (this.$refs.comment.textContent) {
        this.running = true
      } else {
        this.running = false
      }
    })
    this.mo.observe(this.$refs.comment, MutationObserverConfig)
  }
}
</script>

<style scoped>
.selenium-comment {
  font-weight: initial;
}
.selenium-key {
  visibility: hidden;
}
</style>
