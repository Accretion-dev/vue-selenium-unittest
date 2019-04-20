<template>
  <div id="test-env" class="test-env">
    <mouse-icon v-show="mouse"
      ref="mouse"
      :name="mouseType"
      :class="{[mouseStatus]: true}"
    />
    <span style="position: fixed; top: 20px; right: 20px; z-index:999;">
      <Button @click="doFoldAll">
        {{ folding }}
      </Button>
      <Button @click="showInfo = !showInfo">
        Info Panel
      </Button>
    </span>
    <div v-show="running||showInfo" class="test-info">
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
import mouseIcon from './mouse-icon.vue'
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
  js: 'JS',
}
export default {
  name: 'test-env',
  components: {ClipLoader, mouseIcon},
  props: {
  },
  data () {
    return {
      blocks: [],
      folding: '-',
      running: false,
      comment: '',
      showInfo: false,
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
        js: 'default',
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
        js: false,
      },
      working: '',
      mouse: false,
      mouseType: 'box',
      mouseTimer: null,
      mouseTimeout: 1000,
      mouseStatus: 'release',
      modifiers: ['CONTROL', 'ALT', "META", 'SHIFT'],
      maxActions: 15,
      timeout: 5000,
      actions: [],
      timers: [],
      actionCount: 0,
      x: 0,
      y: 0,
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
      } else if (type === 'js')   {
        this.addAction({type, name: 'js', count})
      } else if (type === 'keyUp') {
        this.addAction({type, name, count})
      } else if (type === 'keyDown') {
        this.addAction({type, name, count})
      } else if (type === 'sleep') {
        this.addAction({type, name, count})
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
        this.showMouse(name, type)
        this.addAction({type, name:'MO', count})
      } else if (type === 'press') {
        this.showMouse(name, type)
        this.addAction({type, name:'PR', count})
      } else if (type === 'release') {
        this.showMouse(name, type)
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
    this.blocks = this.$children.filter(_ => _.$options.name === 'test-block')
    let testFold = () => {
      if (this.blocks.every(_ => _.$data.open)) {
        this.folding = "-"
      } else if (this.blocks.every(_ => !_.$data.open)) {
        this.folding = "+"
      } else {
        this.folding = "?"
      }
    }
    this.blocks.forEach(vm => {
      vm.$on("fold", testFold)
    })
  },
  methods: {
    doFoldAll () {
      if (this.folding === '-') {
        this.folding = '+'
        this.blocks.forEach(vm => {
          vm.$data.open = false
        })
      } else if (this.folding === '?') {
        this.folding = '-'
        this.blocks.forEach(vm => {
          vm.$data.open = true
        })
      } else if (this.folding === '+') {
        this.folding = '-'
        this.blocks.forEach(vm => {
          vm.$data.open = true
        })
      }
    },
    moveMouse ({oldPos, newPos, duration}) {
      console.log(JSON.stringify({oldPos, newPos}))
      this.$refs.mouse.$el.style.top = newPos.y
      this.$refs.mouse.$el.style.left = newPos.x
    },
    showMouse (pos, type) {
      if (type === 'click') {
        pos = JSON.parse(pos)
        let x = pos.x + pos.width/2 - window.scrollX
        let y = pos.y + pos.height/2 - window.scrollY
        this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
        this.x = x
        this.y = y
        this.mouseType = 'left'
        this.mouse = true
        this.mouseStatus = 'click'
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouseStatus = 'release'
        }, this.mouseTimeout)
      } else if (type === 'doubleClick') {
        pos = JSON.parse(pos)
        let x = pos.x + pos.width/2 - window.scrollX
        let y = pos.y + pos.height/2 - window.scrollY
        this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
        this.x = x
        this.y = y
        this.mouseType = 'double'
        this.mouseStatus = 'click'
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouseStatus = 'release'
        }, this.mouseTimeout)
      } else if (type === 'contextClick') {
        pos = JSON.parse(pos)
        let x = pos.x + pos.width/2 - window.scrollX
        let y = pos.y + pos.height/2 - window.scrollY
        this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
        this.x = x
        this.y = y
        this.mouseType = 'right'
        this.mouse = true
        this.mouseStatus = 'click'
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouseStatus = 'release'
        }, this.mouseTimeout)
      } else if (type === 'move') {
        pos = JSON.parse(pos)
        if (pos.type === 'element') {
          let x = pos.x + pos.width/2 - window.scrollX + pos.dx
          let y = pos.y + pos.height/2 - window.scrollY + pos.dy
          this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
          this.x = x
          this.y = y
        } else if (pos.type === 'viewpoint') {
          let x = pos.dx
          let y = pos.dy
          this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
          this.x = x
          this.y = y
        } else {
          let x = this.x + pos.dx
          let y = this.y + pos.dy
          this.moveMouse({newPos: {x, y}, oldPos:{x: this.x, y: this.y}})
          this.x = x
          this.y = y
        }
        this.mouseType = 'move'
        this.mouse = true
        if (this.mouseStatus !== 'press') {
          this.mouseStatus = 'click'
          clearTimeout(this.mouseTimer)
          setTimeout(() => {
            this.mouseStatus = 'release'
          }, this.mouseTimeout)
        }
      } else if (type === 'press') {
        this.mouseType = pos
        this.mouse = true
        this.mouseStatus = 'press'
      } else if (type === 'release') {
        this.mouseStatus = 'release'
        clearTimeout(this.mouseTimer)
        setTimeout(() => {
          this.mouse = false
        }, this.mouseTimeout)
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
  z-index: 950;
  position: fixed;
  background:#eee;
  width: 100%;
  padding: 20px;
  opacity: .95;
  top: 0px;
  display: inline-flex;
}
.mouse-icon {
  z-index: 950;
  width: 40px;
  height: 40px;
  color: black;
  position: fixed;
  top: 0px;
  left: 0px;
  pointer-events: none;
}
.press {
  opacity: 1;
  color: red;
}
.release {
  opacity: 0;
  animation: release 2s;
}
.click {
  opacity: 1;
}
@keyframes release {
  from {opacity: 1}
  to {opacity: 0}
}
</style>
