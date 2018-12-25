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

fun HtmlBlockTag.mTextBox(elementId: String, label: String) {
    MTextBox(consumer).visit {
        label { htmlFor = elementId; +label }
        textInput { id = elementId }
    }
}

fun HtmlBlockTag.mTextArea(elementId: String, label: String) {
    MTextArea(consumer).visit {
        label { htmlFor = elementId; +label }
        textArea { id = elementId }
    }
}

fun HtmlBlockTag.mButton(elementId: String, label: String) {
    MButton(consumer).visit {
        id = elementId
        name = elementId
        +label
    }
}

class MCheckbox(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_checkbox"), consumer)
class MSelect(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_select"), consumer)
class MTextBox(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_text-box"), consumer)
class MTextArea(consumer: TagConsumer<*>) : DIV(attributesMapOf("class", "m-input m-input_text-area"), consumer)
class MButton(consumer: TagConsumer<*>) : BUTTON(attributesMapOf("class", "m-input m-input_button"), consumer)