package io.zoku.elements

import kotlinx.html.*
import kotlinx.html.dom.createHTMLDocument
import org.w3c.dom.Document

object HTML {
    fun site(title: String, block: DIV.() -> Unit = {}): Document {
        return createHTMLDocument().html {
            head {
                title { +"AnonImage | $title" }
                meta(name = "desciption", content = "Anonymise your images with ease.")

                styleLink(url = "/assets/styles/styles.css")
            }

            body {
                div(classes = "m-constraint") {
                    h1(classes = "m-headline") { +"AnonImage | $title" }
                    a(href = "/") {
                        img(classes = "m-title", src = "/assets/img/title.png", alt = "Title image / Logo")
                    }

                    block.invoke(this)

                    section(classes = "m-footer") {
                        a(classes = "m-footer--link", href = "/pages/imprint") { +"Imprint" }
                        a(classes = "m-footer--link", href = "/pages/privacy") { +"Privacy policy" }
                        a(classes = "m-footer--link", href = "/pages/faq") { +"How to use (FAQ)" }
                        a(classes = "m-footer--link", href = "https://www.github.com/zoku/anonimage") { +"Code on Github" }
                    }
                }

                script(type = "text/javascript", src = "/assets/js/lib/jquery-3.3.1.min.js") {}
                script(type = "text/javascript", src = "/assets/js/application.js") {}
            }
        }
    }
}