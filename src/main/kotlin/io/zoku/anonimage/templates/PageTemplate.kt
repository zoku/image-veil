package io.zoku.anonimage.templates

import io.zoku.anonimage.utils.I18n
import kotlinx.html.*
import kotlinx.html.dom.createHTMLDocument
import org.w3c.dom.Document
import java.util.*
import javax.servlet.http.HttpServletRequest

object PageTemplate {
    fun site(title: String, request: HttpServletRequest, block: DIV.() -> Unit = {}): Document {
        val lang = request.getParameter("l") ?: request.locale.language
        val i18n = I18n(Locale(lang))

        return createHTMLDocument().html {
            head {
                title { +"AnonImage | $title" }
                meta(name = "desciption", content = i18n.get("app.description"))
                meta { charset = "utf-8" }

                styleLink(url = "/assets/styles/styles.css")
            }

            body {
                div(classes = "m-constraint") {
                    h1(classes = "m-headline") { +"AnonImage | $title" }
                    a(href = "/${if(request.getParameter("l") != null) "?l=$lang" else "" }") {
                        img(classes = "m-title", src = "/assets/img/title.png", alt = i18n.get("app.logo.alt"))
                    }

                    block.invoke(this)

                    section(classes = "m-footer") {
                        a(classes = "m-footer--link", href = "/pages/${i18n.get("app.pages.imprint.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.imprint") }
                        a(classes = "m-footer--link", href = "/pages/${i18n.get("app.pages.privacy.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.privacy") }
                        a(classes = "m-footer--link", href = "/pages/${i18n.get("app.pages.howto.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.howto") }
                        a(classes = "m-footer--link", href = "/pages/${i18n.get("app.pages.faq.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.faq") }
                        a(classes = "m-footer--link", href = "https://www.github.com/zoku/anonimage") { +i18n.get("app.footer.links.github") }
                    }
                }

                script(type = "text/javascript", src = "/assets/js/lib/jquery-3.3.1.min.js") {}
                script(type = "text/javascript", src = "/assets/js/application.js") {}
            }
        }
    }
}