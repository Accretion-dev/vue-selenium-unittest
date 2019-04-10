<template>
  <div id="test-env" class="test-env">
    <div v-show="running" class="test-info">
      <Icon v-show="mouse" type="ios-nutrition" class="mouse-pointer"/>
      <clip-loader :loading="true" color="green" size="40px" style=".loader"/>
      <div class="">
        <h3>
          <span style="padding-left: 5px;"> {{ working }}: </span>
          <span ref="comment" class="selenium-comment">{{ comment }}</span>
        </h3>
        <p ref="keys" class="keys">
          <span ref="modifier">
            <Button v-for="{name, type, count} of actions"
                    :key="count"
                    :type="typeMap[type]"
                    :ghost="ghostMap[type]"
                    class="key-button"
                    size="small"
            >
              {{ name in symbolMap ? symbolMap[name] : name }}
            </Button>
          </span>
        </p>
      </div>
    </div>
    <slot> </slot>
  </div>
</template>

<script>
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
const symbolMap = {
  CONTROL: '⌃',
  ALT: '⌥',
  COMMAND: '⌘',
  META: '⌘',
  BACK_SPACE: '⌫',
  TAB: "TAB",
  RETURN: "⏎",
  ENTER: "⏎",
  SHIFT: "⇧",
  PAUSE: "PAUSE",
  ESCAPE: 'ESC',
  SPACE: '⌴',
  PAGE_UP: 'PgDown',
  PAGE_DOWN: 'PgUP',
  END: 'END',
  HOME: 'HOME',
  ARROW_LEFT: "←",
  LEFT: "←",
  ARROW_UP: "↑",
  UP: "↑",
  ARROW_RIGHT: "→",
  RIGHT: "→",
  ARROW_DOWN: "↓",
  DOWN: "↓",
  INSERT: "INS",
  DELETE: "DEL",
  SEMICOLON: ',',
  EQUALS: '=',
  NUMPAD0: 'NUM0',
  NUMPAD1: 'NUM1',
  NUMPAD2: 'NUM2',
  NUMPAD3: 'NUM3',
  NUMPAD4: 'NUM4',
  NUMPAD5: 'NUM5',
  NUMPAD6: 'NUM6',
  NUMPAD7: 'NUM7',
  NUMPAD8: 'NUM8',
  NUMPAD9: 'NUM9',
  MULTIPLY: '*',
  ADD: '+',
  SEPARATOR: ',',
  SUBTRACT: '-',
  DECIMAL: '.',
  DIVIDE: '/',
}
export default {
  name: 'test-env',
  components: {ClipLoader},
  props: {
  },
  data () {
    return {
      running: false,
      comment: '',
      symbolMap,
      typeMap: {
        key: 'default',
        keyDown: 'primary',
        keyUp: 'default',
        click: 'default',
        contextClick: 'default',
      },
      ghostMap: {
        key: false,
        keyDown: false,
        keyUp: true,
        click: false,
        contextClick: false,
      },
      working: '',
      mouse: false,
      modifiers: ['CONTROL', 'ALT', "META", 'SHIFT'],
      maxActions: 15,
      timeout: 5000,
      actions: [],
      timers: [],
      actionCount: 0,
    }
  },
  mounted () {
    this.$watch('seleniumData.action', (action) => {
      if (!action) return
      let [type, name] = action.split(' ')
      this.actionCount += 1
      let count = this.actionCount
      if (type === 'key') {
        this.addAction({type, name, count})
      } else if (type === 'keyUp') {
        if (this.modifiers.includes(name)) {
          this.addAction({type, name, count})
        }
      } else if (type === 'keyDown') {
        if (this.modifiers.includes(name)) {
          this.addAction({type, name, count})
        }
      } else if (type === 'click') {
        this.addAction({type, name:'CL', count})
      } else if (type === 'contextClick') {
        this.addAction({type, name:'CR', count})
      } else if (type === 'doubleClick') {
      } else if (type === 'dragAndDrop') {
      } else if (type === 'move') {
      } else if (type === 'press') {
      } else if (type === 'release') {
      }
    })
    this.$watch('seleniumData.working', (working) => {
      this.working = working
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
    this.$watch('seleniumData.comment', (comment) => {
      this.comment = comment
      if (comment) {
        this.running = true
      } else {
        this.running = false
      }
    })
  },
  methods: {
    addAction (action) {
      if (this.actions.length <= this.maxActions) {
        this.actions.splice(0, 0, action)
        //this.timers.push(setTimeout(() => {
        //  this.actions.pop()
        //  this.timers.pop()
        //}, this.timeout))
      } else {
        this.actions.pop()
        let timer = this.timers.pop()
        clearTimeout(timer)
        this.actions.splice(0, 0, action)
        //this.timers.push(setTimeout(() => {
        //  this.actions.pop()
        //  this.timers.pop()
        //}, this.timeout))
      }
    }
  },
}
</script>

<style lang="scss">
.keys {
  padding-left: 5px;
}
.key-button:first-child {
  position: relative;
  left: 10px;
  top: 10px;
  transform: scale(1.8);
  padding: 2px;
  z-index: +1;
}
.key-button {
  position: relative;
  top: 10px;
  left: 25px;
}
.mouse-pointer {
  position: fixed;
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
