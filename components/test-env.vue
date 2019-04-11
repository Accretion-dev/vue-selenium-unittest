<template>
  <div id="test-env" class="test-env">
    <v-icon v-show="mouse" ref="mouse" :name="mouseType" :class="{press, click, release}"/>
    <div v-show="running" class="test-info">
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
        doubleClick: 'default',
        press: 'primary',
        release: 'default',
        mouve: 'default',
        dragAndDrop: 'default',
      },
      ghostMap: {
        key: false,
        keyDown: false,
        keyUp: true,
        click: false,
        contextClick: false,
        doubleClick: false,
        press: false,
        release: true,
        move: false,
        dragAndDrop: false,
      },
      working: '',
      mouse: false,
      mouseType: 'box',
      mouseTimer: null,
      mouseTimeout: 1000,
      press: false,
      click: false,
      release: false,
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
        this.showMouse(name, type)
        this.addAction({type, name:'CL', count})
      } else if (type === 'contextClick') {
        this.showMouse(name, type)
        this.addAction({type, name:'CR', count})
      } else if (type === 'doubleClick') {
        this.showMouse(name, type)
        this.addAction({type, name:'DC', count})
      } else if (type === 'dragAndDrop') {
        this.addAction({type, name:'DD', count})
      } else if (type === 'move') {
        this.addAction({type, name:'MO', count})
      } else if (type === 'press') {
        this.addAction({type, name:'PR', count})
      } else if (type === 'release') {
        this.addAction({type, name:'RE', count})
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
    showMouse (pos, type) {
      pos = JSON.parse(pos)
      if (type === 'click') {
        let x = pos.x + pos.width/2 - window.scrollX - 40*0.2
        let y = pos.y + pos.height/2 - window.scrollY - 40*0.2
        this.$refs.mouse.$el.style.top = y
        this.$refs.mouse.$el.style.left = x
        this.mouseType = 'arrow-up-left'
        this.mouse = true
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouse = false
        }, this.mouseTimeout)
      } else if (type === 'doubleClick') {
        let x = pos.x + pos.width/2 - window.scrollX - 40*0.2
        let y = pos.y + pos.height/2 - window.scrollY - 40*0.2
        this.$refs.mouse.$el.style.top = y
        this.$refs.mouse.$el.style.left = x
        this.mouseType = 'arrow-up-left'
        this.mouse = true
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouse = false
        }, this.mouseTimeout)
      } else if (type === 'contextClick') {
        let x = pos.x + pos.width/2 - window.scrollX - 40*0.8
        let y = pos.y + pos.height/2 - window.scrollY - 40*0.2
        this.$refs.mouse.$el.style.top = y
        this.$refs.mouse.$el.style.left = x
        this.mouseType = 'arrow-up-right'
        this.mouse = true
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouse = false
        }, this.mouseTimeout)
      } else if (type === 'move') {
      } else if (type === 'press') {
      } else if (type === 'release') {
      }
    },
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
.v-icon {
  width: 40px;
  height: 40px;
  color: black;
  position: fixed;
  z-index: +10;
  top: 0px;
  left: 0px;
  pointer-events: none;
}
.press {
  opacity: 1;
  transform: scale(1.5)
}
.release {
  opacity: 1;
}
.click {
  opacity: 0;
  animation: click 2s;
  animation: clickSize 0.5s;
}
@keyframes click {
  from {opacity: 1}
  to {opacity: 0}
}
@keyframes clickSize {
  from {transform: scale(1.5)}
  to {transform: scale(1)}
}
</style>
