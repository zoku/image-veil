package io.zoku.anonimage.templates

import io.zoku.anonimage.utils.I18n
import kotlinx.html.*
import kotlinx.html.dom.createHTMLDocument
import org.w3c.dom.Document
import java.util.*
import javax.servlet.http.HttpServletRequest

object PageTemplate {
    fun site(title: String, request: HttpServletRequest, pageId: String? = null, block: DIV.() -> Unit = {}): Document {
        val lang = request.getParameter("l") ?: request.locale.language
        val i18n = I18n(Locale(lang))

        return createHTMLDocument().html {
            head {
                title { +"AnonImage | $title" }
                meta(name = "desciption", content = i18n.get("app.description"))
                meta { charset = "utf-8" }

                link(rel = "icon", type = "image/png", href = "${request.contextPath}/assets/img/favicon.png")

                styleLink(url = "${request.contextPath}/assets/styles/styles.css")
            }

            body {
                div(classes = "m-constraint") {
                    h1(classes = "m-headline") { +"AnonImage | $title" }
                    a(href = "${request.contextPath}/${if(request.getParameter("l") != null) "?l=$lang" else "" }") {
                        img(classes = "m-title", src = "${request.contextPath}/assets/img/title.png", alt = i18n.get("app.logo.alt"))
                    }

                    val supportedLanguages = arrayListOf("de", "en") // Add rm for Roman Empire and pi for Pirate, also es, fr, it, ru, gr

                    div(classes = "m-language") {
                        div(classes = "m-language--preview") { img(src = "${request.contextPath}/assets/img/flags/$lang.jpg");+" ${lang.toUpperCase()}" }
                        ul(classes = "m-language--list") {
                            supportedLanguages.forEach { language ->
                                if (language != lang) {
                                    li(classes = "m-language--list--item") {
                                        val pageUri = when {
                                            pageId != null -> "${request.contextPath}/pages/${i18n.get("app.pages.imprint.uri", Locale(language))}"
                                            request.requestURI == "/error" -> "${request.contextPath}/"
                                            else -> "${request.contextPath}${request.requestURI}"
                                        }

                                        a(href = "$pageUri?l=$language") {
                                            img(src = "${request.contextPath}/assets/img/flags/$language.jpg"); + " ${language.toUpperCase()}"
                                        }
                                    }
                                }
                            }
                        }
                    }

                    block.invoke(this)

                    section(classes = "m-footer") {
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.imprint.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.imprint") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.privacy.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.privacy") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.howto.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.howto") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.faq.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.faq") }
                        a(classes = "m-footer--link", href = "https://www.github.com/zoku/anonimage") { +i18n.get("app.footer.links.github") }
                    }
                }

                script(type = "text/javascript", src = "${request.contextPath}/assets/js/lib/jquery-3.3.1.min.js") {}
                script(type = "text/javascript", src = "${request.contextPath}/assets/js/application.js") {}
            }
        }
    }
}