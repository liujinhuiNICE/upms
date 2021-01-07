import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import {
    Button, Select, Container, Header, Aside, Main, Footer, Submenu, Dropdown, DropdownMenu, DropdownItem, MenuItem, Pagination, Dialog, Menu, Scrollbar, Breadcrumb, BreadcrumbItem, Message, Input,
    InputNumber, Form, FormItem, Checkbox, CheckboxButton, CheckboxGroup, MessageBox, Tooltip, Table, TableColumn, Option, OptionGroup, Switch, Tree, Radio, RadioGroup, RadioButton, Popover, DatePicker,
    TimeSelect,
    TimePicker,
    Badge,
    Collapse,
    CollapseItem,
    Card,
    Divider
} from 'element-ui'
Vue.use(Divider)
Vue.use(Card)
Vue.use(CollapseItem)
Vue.use(Collapse)
Vue.use(Popover)
Vue.use(Button)
Vue.use(Select)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Submenu)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(MenuItem)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Scrollbar)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Switch)
Vue.use(Tree)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(DatePicker)
Vue.use(TimeSelect)
Vue.use(TimePicker)
Vue.use(Badge)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
