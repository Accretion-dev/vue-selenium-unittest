<template>
  <span>
    <Button :type="running ? 'warning' : 'info'" @click="doTest" size="small" :disabled="disabled">
      {{ running ? 'Stop' : 'Run' }}
    </Button>
  </span>
</template>

<script>
import axios from 'axios'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default {
  name: 'test-button',
  watch: {
    running (newValue, oldValue) {
      console.log(newValue, oldValue)
      if (!newValue && oldValue) {
        this.disabled = true
        setTimeout(() => {
          this.disabled = false
        }, 1500)
      }
    }
  },
  props: {
    name: {
      required: true,
      type: String,
    },
    running: {
      required: true,
      type: Boolean,
    },
  },
  data () {
    return {
      disabled: false
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
