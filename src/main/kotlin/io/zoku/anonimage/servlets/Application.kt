package io.zoku.anonimage.servlets

import io.zoku.anonimage.utils.I18n
import io.zoku.anonimage.templates.PageTemplate
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import kotlinx.html.*
import kotlinx.html.dom.*
import java.util.*

@WebServlet(
        name = "AnonImageApp",
        displayName = "AnonImage WebApplication",
        description = "Provides an API to pixelate/blur images, remove exif data and change chip characteristics.",
        urlPatterns = [ "" ]
)
class Application : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val lang = request.getParameter("l") ?: request.locale.language
        val i18n = I18n(Locale(lang))

        val dom = PageTemplate.site("App", request) {
            div(classes = "m-settings") {
                a(classes = "m-settings--toggle", href = "#") {
                    i(classes = "fas fa-cogs m-settings--toggle--cogs")
                    i(classes = "fas fa-times m-settings--toggle--x")
                }

                div(classes = "m-mode") {
                    label { htmlFor = "mode"; +i18n.get("app.main.mode.caption") }
                    select {
                        id = "mode"
                        option { value = "square"; +i18n.get("app.main.mode.options.square"); attributes["selected"] = "" }
                        option { value = "fill"; +i18n.get("app.main.mode.options.fill") }
                        option { value = "none"; +i18n.get("app.main.mode.options.none") }
                    }
                }
            }

            div(classes = "m-upload") {
                attributes["data-i18n--file-size-hint"] = i18n.get("js.fileSizeHint")
                attributes["data-i18n--new-file-hint"] = i18n.get("js.newFileHint")

                p(classes = "m-upload--text") { +i18n.get("app.main.upload.startHint") }
                form(encType = FormEncType.multipartFormData) {
                    id = "uploadform"
                    fileInput(name = "image") { id = "imageFile"; accept = "image/jpeg" }
                    hiddenInput(name = "options") { id = "imageOptions" }
                }
            }

            div(classes = "m-preview") {
                div(classes = "m-preview--shadow")
                div(classes = "m-preview--areas")
                img(classes = "m-preview--image", src = "${request.contextPath}/assets/img/preview.png", alt = i18n.get("app.main.preview.image.alt"))
            }

            div(classes = "m-progress") {
                id = "progress"
                div(classes = "m-progress--label") {
                    attributes["data-i18n--upload"] = i18n.get("app.main.progress.label.upload")
                    attributes["data-i18n--work"] = i18n.get("app.main.progress.label.work")
                    attributes["data-i18n--download"] = i18n.get("app.main.progress.label.download")
                }
                div(classes = "m-progress--bar") {}
            }

            input(type = InputType.button) { id = "startButton"; value = i18n.get("app.main.startCta.caption") }

            div(classes = "m-download") {
                a( classes = "m-download--close", href = "#") { i(classes = "fas fa-times") }
                div(classes = "m-download--content") {
                    h2 { +i18n.get("app.download.headline") }
                    p { +i18n.get("app.download.hint") }
                    img(src = "${request.contextPath}/assets/img/preview.png", alt = i18n.get("app.download.image.alt"))
                }
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}