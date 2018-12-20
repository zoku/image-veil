package net.imageveil.app.templates

import net.imageveil.app.utils.I18n
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
                title { +"ImageVeil | $title" }
                meta(name = "desciption", content = i18n.get("app.description"))
                meta(name = "viewport", content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0")
                meta { charset = "utf-8" }

                ogUrl(content = "https://image-veil.net")
                ogTitle(content = "ImageVeil")
                ogDescription(content = "ImageVeil is an image anonymisation tool that is free and safe to use.")
                ogImage(content = "https://image-veil.net/assets/img/fb_preview3.jpg")
                ogImageWidth(1080)
                ogImageHeight(565)
                ogType(content = "website")
                ogLocale(content = "alternate")

                link(rel = "icon", type = "image/png", href = "${request.contextPath}/assets/img/favicon.png")

                styleLink(url = "${request.contextPath}/assets/styles/styles.css")

            }

            body {
                div(classes = "m-constraint") {
                    a(classes = "m-title", href = "${request.contextPath}/${if(request.getParameter("l") != null) "?l=$lang" else "" }") {
                        img(classes = "m-title--image", src = "${request.contextPath}/assets/img/logo.png", alt = i18n.get("app.logo.alt"))
                        div(classes = "m-title--text") { +"ImageVeil" }
                    }

                    val supportedLanguages = arrayListOf("de", "en") // Add rm for Roman Empire and pi for Pirate, also es, fr, it, ru, gr

                    div(classes = "m-language") {
                        div(classes = "m-language--preview") { img(src = "${request.contextPath}/assets/img/flags/$lang.jpg");+" ${lang.toUpperCase()}" }
                        ul(classes = "m-language--list") {
                            supportedLanguages.forEach { language ->
                                if (language != lang) {
                                    li(classes = "m-language--list--item") {
                                        val pageUri = when {
                                            pageId != null -> "${request.contextPath}/pages/${i18n.get("app.pages.$pageId.uri", Locale(language))}"
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
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.about.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.about") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.imprint.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.imprint") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.privacy.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.privacy") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.howto.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.howto") }
                        a(classes = "m-footer--link", href = "${request.contextPath}/pages/${i18n.get("app.pages.faq.uri")}${if(request.getParameter("l") != null) "?l=$lang" else "" }") { +i18n.get("app.footer.links.faq") }
                        a(classes = "m-footer--link", href = "https://github.com/zoku/image-veil") { +"${i18n.get("app.footer.links.github")} "; i(classes = "fab fa-github") }
                    }
                }

                script(type = "text/javascript", src = "${request.contextPath}/assets/js/lib/jquery-all.min.js") {}
                script(type = "text/javascript", src = "${request.contextPath}/assets/js/application.js") {}
            }
        }
    }
}