<!-- 
    自定义编辑容器
    Web聊天工具的富文本输入框
    传统的输入框都是使用 <textarea> 来制作的，它的优势是非常简单，但最大的缺陷却是无法展示图片。为了能够让输入框能够展示图片（富文本化），我们可以采用设置了 contenteditable="true" 属性的 <div> 来实现这里面的功能。
    基本功能：文本+表情
 -->
 <template>
  <div id="customEditor">
    <!-- emojis start -->
    <div class="emoji">
      <div class="emoji-list">
        <section v-for="(key, keyIndex) in Object.keys(emoji)" :key="keyIndex">
          <span class="emoji-list-item" v-for="(item, index) in emoji[key]" :key="index" @click="insertEmoji(item)">
            {{item}}
          </span>
        </section>
      </div>
    </div>
    <!-- emojis end -->

    <!-- editor start -->
    <div
      class="editor"
      contenteditable="true"
      ref="editor"
      @keyup="getCursor"
      @paste.prevent="onPaste"
      @click="getCursor"
       @keydown.enter.prevent="submit">

    </div>
    <!-- editor end -->

    <!-- tips start -->
    <div class="tips-area">
      Enter 发送，Ctrl+Enter 换行
    </div>
    <!-- tips end -->
  </div>
</template>

<style scoped lang="less">
  #customEditor{
    .emoji{
      .emoji-list{
        span{
          cursor: pointer;
        }
      }
    }
    .editor {
      margin-top:15px;
      margin-bottom: 5px;
      width: 100%;
      height: 200px;
      border-radius: 4px;
      background: #fff;
      border: 1px solid #ccc;
      box-sizing: border-box;
      padding:10px;
      overflow: auto;
      word-break: break-all;
      overflow-wrap: break-word;
      outline: none;
    }
    .tips-area{
      text-align: right;
      font-style: italic;
      color: #666;
      font-size: 12px;
      margin-right: 5px;
    }
  }
</style>

<script>
  /**
   * 预览函数
   *
   * @param {*} dataUrl base64字符串
   * @param {*} cb 回调函数
   */
  function toPreviewer (dataUrl, cb) {
    cb && cb(dataUrl)
  }

  /**
   * 图片压缩函数
   *
   * @param {*} img 图片对象
   * @param {*} fileType  图片类型
   * @param {*} maxWidth 图片最大宽度
   * @returns base64字符串
   */
  function compress (img, fileType, maxWidth) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    const proportion = img.width / img.height
    const width = maxWidth
    const height = maxWidth / proportion

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, width, height)

    const base64data = canvas.toDataURL(fileType, 0.75)
    canvas = ctx = null

    return base64data
  }

  /**
   * 选择图片函数
   *
   * @param {*} e input.onchange事件对象
   * @param {*} cb 回调函数
   * @param {number} [maxsize=200 * 1024] 图片最大体积
   */
  function chooseImg (e, cb, maxsize = 200 * 1024) {
    const file = e.target.files[0]

    if (!file || !/\/(?:jpeg|jpg|png)/i.test(file.type)) {
      return
    }

    const reader = new FileReader()
    reader.onload = function () {
      const result = this.result
      let img = new Image()

      if (result.length <= maxsize) {
        toPreviewer(result, cb)
        return
      }

      img.onload = function () {
        const compressedDataUrl = compress(img, file.type, maxsize / 1024)
        toPreviewer(compressedDataUrl, cb)
        img = null
      }

      img.src = result
    }

    reader.readAsDataURL(file)
  }
  /**
   * 输入框的粘贴内容函数
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  const onPaste = (e) => {
    // 如果剪贴板没有数据则直接返回
    if (!(e.clipboardData && e.clipboardData.items)) {
      return
    }
    // 用Promise封装便于将来使用
    // console.table(e.clipboardData.items)
    return new Promise((resolve, reject) => {
      // 复制的内容在剪贴板里位置不确定，所以通过遍历来保证数据准确
      for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
        const item = e.clipboardData.items[i]
        // 文本格式内容处理
        if (item.kind === 'string') {
          item.getAsString((str) => {
            resolve(str)
          })
        // 图片格式内容处理
        } else if (item.kind === 'file') {
          const pasteFile = item.getAsFile()
          // 处理pasteFile
          // TODO(pasteFile)
          const imgEvent = {
            target: {
              files: [pasteFile]
            }
          }
          chooseImg(imgEvent, (url) => {
            resolve(url)
          })
        } else {
          reject(new Error('Not allow to paste this type!'))
        }
      }
    })
  }

  /**
   * 获取光标位置
   * @param {DOMElement} element 输入框的dom节点
   * @return {Number} 光标位置
   */
  const getCursorPosition = (element) => {
    let caretOffset = 0
    const doc = element.ownerDocument || element.document
    const win = doc.defaultView || doc.parentWindow
    const sel = win.getSelection()
    if (sel.rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    }
    return caretOffset
  }

  /**
   * 设置光标位置
   * @param {DOMElement} element 输入框的dom节点
   * @param {Number} cursorPosition 光标位置的值
   */
  const setCursorPosition = (element, cursorPosition) => {
    const range = document.createRange()
    range.setStart(element.firstChild, cursorPosition)
    range.setEnd(element.firstChild, cursorPosition)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const emoji = {
    smiles: '😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍'.split(' ')
  }

  export default {
    name: 'customEditor',
    data () {
      return {
        editor: null,
        cursorPosition: 0,//目前光标位置
        emoji,
      }
    },
    mounted () {
      this.editor = this.$refs['editor']
    },
    methods: {
      //回车提交内容
      submit (e) {
        const value = e.target.innerHTML.replace(/[\n\r]$/, '')
        if (value) {
          console.info('Submit text', { value })
          e.target.innerText = ''
        }
      },
      //粘贴内容（文本+图片）
      async onPaste (e) {
        const result = await onPaste(e)
        console.log(result)
        //将图片转换为base64格式
        const imgRegx = /^data:image\/png;base64,/
        // 如果是图片格式（base64），则通过构造range的办法把<img>标签插入正确的位置
        // 如果是文本格式，则通过document.execCommand('insertText')方法把文本插入
        //粘贴图片
        if (imgRegx.test(result)) {
          const sel = window.getSelection()
          if (sel && sel.rangeCount === 1 && sel.isCollapsed) {
            const range = sel.getRangeAt(0)
            const img = new Image()
            img.src = result
            range.insertNode(img)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
          }

          document.execCommand('insertImage', false, result)
        //粘贴文本(也包括emoji)
        } else {
          document.execCommand('insertText', false, result)
        }
      },
      //获取光标位置
      getCursor () {
        this.cursorPosition = getCursorPosition(this.editor)
      },
      //插入表情
      insertEmoji (emoji) {
        const text = this.editor.innerHTML
        // 插入 emoji
        this.editor.innerHTML = text.slice(0, this.cursorPosition) + emoji + text.slice(this.cursorPosition, text.length)
        // 光标位置后挪一位，以保证在刚插入的 emoji 后面
        setCursorPosition(this.editor, this.cursorPosition + 1)
        // 更新本地保存的光标位置变量（注意 emoji 占两个字节大小，所以要加1）
        this.cursorPosition = getCursorPosition(this.editor) + 1 //  emoji 占两位
      }
    }
  }

</script>