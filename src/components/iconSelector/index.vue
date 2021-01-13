<template>
  <el-popover
    v-model="popoverVisible"
    placement="bottom-start"
    popper-class="pupop-select-icon"
    transition="el-zoom-in-top"
    trigger="click"
    :disabled="disabledSelected"
  >
    <!-- 弹出框内容区 -->
    <el-scrollbar
      v-if="popoverVisible"
      class="hide-x"
      :native="false"
      :noresize="false"
    >
      <!-- 图标项 -->
      <div
        v-for="item in iconData"
        :key="item"
        class="icon-item"
        :class="{ 'is-active': isActive(item) }"
        @click="onClickSelected(item)"
      >
        <i :class="item" />
      </div>
    </el-scrollbar>
    <!-- 页面显示内容区 -->
    <template slot="reference">
      <div
        :class="{
          'mod-select-icon': 1,
          'is-opened': popoverVisible,
          'is-active': value,
          'is-disabled': disabledSelected
        }"
      >
        <!-- 显示图标 -->
        <div class="icon-item">
          <i :class="value || 'el-icon-plus'" />
        </div>
        <!-- 清空按钮 -->
        <div v-show="value" class="btn-clear">
          <i class="el-icon-close" @click.stop="onClickClear()" />
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>

export default {
  name: 'SelectIcon',
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selecteds'
  },
  props: {
    disabled: Boolean,
    // 接收绑定参数 - 图标类名
    value: {
      type: String,
      required: true
    }
    // // 选项数据，图标类名数组
    // options: {
    //     type: Array,
    //     default: () => ([]),
    // },
  },
  data() {
    return {
      // 弹出框显示状态
      popoverVisible: false,
      iconData: [
        'el-icon-platform-eleme', 'el-icon-eleme', 'el-icon-s-cooperation', 'el-icon-s-order', 'el-icon-s-claim', 'el-icon-s-grid',
        'el-icon-menu',
        'el-icon-message-solid',
        'el-icon-s-finance',
        'el-icon-s-promotion',
        'el-icon-s-comment',
        'el-icon-s-home',
        'el-icon-s-release',
        'el-icon-s-data',
        'el-icon-share',
        'el-icon-delete-solid',
        'el-icon-delete',
        'el-icon-s-tools',
        'el-icon-setting',
        'el-icon-user-solid',
        'el-icon-user',
        'el-icon-phone',
        'el-icon-phone-outline',
        'el-icon-more',
        'el-icon-more-outline',
        'el-icon-star-on',
        'el-icon-star-off',
        'el-icon-s-goods',
        'el-icon-goods',
        'el-icon-warning',
        'el-icon-warning-outline',
        'el-icon-question',
        'el-icon-info',
        'el-icon-remove',
        'el-icon-circle-plus',
        'el-icon-success',
        'el-icon-error',
        'el-icon-zoom-in',
        'el-icon-zoom-out',
        'el-icon-remove-outline',
        'el-icon-circle-plus-outline',
        'el-icon-circle-check',
        'el-icon-circle-close',
        'el-icon-s-help',
        'el-icon-help',
        'el-icon-minus',
        'el-icon-plus',
        'el-icon-check',
        'el-icon-close',
        'el-icon-picture',
        'el-icon-picture-outline',
        'el-icon-picture-outline-round',
        'el-icon-upload',
        'el-icon-upload2',
        'el-icon-key',
        'el-icon-service',
        'el-icon-bicycle',
        'el-icon-truck',
        'el-icon-ship',
        'el-icon-basketball',
        'el-icon-football',
        'el-icon-soccer',
        'el-icon-baseball',
        'el-icon-wind-power',
        'el-icon-light-rain',
        'el-icon-lightning',
        'el-icon-heavy-rain',
        'el-icon-sunrise',
        'el-icon-sunset',
        'el-icon-sunny',
        'el-icon-cloudy',
        'el-icon-partly-cloudy',
        'el-icon-cloudy-and-sunny',
        'el-icon-moon',
        'el-icon-sell',
        'el-icon-present',
        'el-icon-box',
        'el-icon-bank-card',
        'el-icon-money',
        'el-icon-coin',
        'el-icon-wallet',
        'el-icon-discount',
        'el-icon-price-tag',
        'el-icon-news',
        'el-icon-guide',
        'el-icon-male',
        'el-icon-female',
        'el-icon-thumb',
        'el-icon-cpu',
        'el-icon-link',
        'el-icon-connection',
        'el-icon-open',
        'el-icon-turn-off',
        'el-icon-set-up',
        'el-icon-chat-round',
        'el-icon-chat-line-round',
        'el-icon-chat-square',
        'el-icon-chat-dot-round',
        'el-icon-chat-dot-square',
        'el-icon-chat-line-square',
        'el-icon-message',
        'el-icon-postcard',
        'el-icon-position',
        'el-icon-turn-off-microphone',
        'el-icon-microphone',
        'el-icon-close-notification',
        'el-icon-bangzhu',
        'el-icon-time',
        'el-icon-odometer',
        'el-icon-crop',
        'el-icon-aim',
        'el-icon-switch-button',
        'el-icon-full-screen',
        'el-icon-copy-document',
        'el-icon-mic',
        'el-icon-reading',
        'el-icon-document-copy',
        'el-icon-document-checked',
        'el-icon-document',
        'el-icon-date',
        'el-icon-edit-outline',
        'el-icon-folder-opened',
        'el-icon-search',
        'el-icon-mobile-phone',
        'el-icon-location',
        'el-icon-first-aid-kit',
        'el-icon-shopping-bag-2'
      ]
    }
  },
  computed: {
    disabledSelected() {
      if (this.disabled) return true
      return this.$parent.form ? this.$parent.form.disabled : false
    }
  },
  methods: {
    // 是否为当前已选项
    isActive(item) {
      return this.value === item
    },
    // 选中图标
    onClickSelected(item) {
      this.$emit('selected', item)
      this.popoverVisible = false
    },
    // 清空选项
    onClickClear() {
      this.$emit('selected', '')
    }
  }
}
</script>

<style>
.btn-clear{
    display: inline-block;
    width: 0;
    height: 0;
}
.mod-select-icon{
    height: 40px;
    position: relative;
    box-sizing: border-box;
    padding-top: 5px;
}
.mod-select-icon .el-icon-close{
    position: absolute;
    top: 0;
    left: 20px;
    cursor: pointer;
}
.icon-item{
    display: inline-block;
    width: 30px;
    height: 30px;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    vertical-align: top;
    line-height: 30px;
}
.icon-item:hover{
    background-color: #ddd;
}
</style>
