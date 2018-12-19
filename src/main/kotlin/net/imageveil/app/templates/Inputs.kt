package net.imageveil.app.templates

import kotlinx.html.*



fun HtmlBlockTag.mCheckbox(elementId: String, label: String, checked: Boolean = false) {
    MCheckbox(consumer).visit {
        input(type = InputType.checkBox) {
            id = elementId
            if (checked) {
                attributes["checked"] = "checked"
            }
        }

        label {
            htmlFor = elementId
            +label
        }
    }
}

fun HtmlBlockTag.mSelect(elementId: String, label: String, block: SELECT.() -> Unit) {
    MSelect(consumer).visit {
        label { htmlFor = elementId; +label }
        select {
            id = elementId
            block.invoke(this)
        }
    }
}

class MCheckbox(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_checkbox"), consumer)
class MSelect(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_select"), consumer)