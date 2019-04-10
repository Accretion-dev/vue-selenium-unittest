<template>
  <div id="test-env" class="test-env">
    <div class="test-info" v-show="running">
      <clip-loader :loading="true" color="green" size="40px" style=".loader"/>
      <div class="">
        <h3>
          <span style="padding-left: 5px;"> {{working}}: </span>
          <span ref="comment" class="selenium-comment"/>
        </h3>
        <p ref='keys' class="keys"> </p>
      </div>
      <span ref="action" class="selenium-action"/>
      <span ref="working" class="selenium-working"/>
    </div>
    <slot> </slot>
  </div>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
export default {
  name: 'test-env',
  components: {ClipLoader},
  props: {
  },
  data () {
    return {
      running: false,
      working: '',
    }
  },
  mounted () {
    const MutationObserverConfig={
      childList: true,
      subtree: true,
      characterData: true
    }
    let obs_comment = new MutationObserver((mutations) => {
      if (this.$refs.comment.textContent) {
        this.running = true
      } else {
        this.running = false
      }
    })
    obs_comment.observe(this.$refs.comment, MutationObserverConfig)

    let obs_working = new MutationObserver((mutations) => {
      this.working = this.$refs.working.textContent
      if (this.working) {
        this.$slots.default.forEach(vnode => {
          if (!vnode.componentOptions.componentOptions === 'test-block') return
          if (vnode.componentInstance.name === this.working) {
            vnode.componentInstance.running = true
          }
        })
      } else {
        this.$slots.default.forEach(vnode => {
          if (!vnode.componentOptions.componentOptions === 'test-block') return
          if (vnode.componentInstance.running) {
            vnode.componentInstance.running = false
          }
        })
      }
    })
    obs_working.observe(this.$refs.working, MutationObserverConfig)
  }
}
</script>

<style scoped>
.keys {
  padding-left: 5px;
}
.loader {

}
.test-env {
  background:#eee;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
.selenium-comment {
  font-weight: initial;
}
.selenium-action {
  visibility: hidden;
}
.selenium-working {
  visibility: hidden;
}
.test-info {
  position: fixed;
  z-index: +1;
  background:#eee;
  width: 100%;
  padding: 20px;
  opacity: .95;
  top: 0px;
  display: inline-flex;
}
</style>
