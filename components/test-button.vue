<template>
  <span>
    <Button :type="running ? 'warning' : 'info'" size="small" :disabled="disabled" @click="doTest">
      {{ running ? 'Stop' : 'Run' }}
    </Button>
  </span>
</template>

<script>
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default {
  name: 'test-button',
  props: {
    name: {
      required: true,
      type: String,
    },
    running: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      disabled: false
    }
  },
  watch: {
    running (newValue, oldValue) {
      if (!newValue && oldValue) {
        this.disabled = true
        setTimeout(() => {
          this.disabled = false
        }, 1500)
      }
    }
  },
  methods: {
    async doTest () {
      let result = await axios.post(
        `http://localhost:${this.$seleniumPort}`,
        {
          name: this.name
        },
        {
          headers: {'X-Requested-With': 'XMLHttpRequest'},
          responseType: 'json',
        }
      )
    }
  }
}
</script>

<style>
</style>
