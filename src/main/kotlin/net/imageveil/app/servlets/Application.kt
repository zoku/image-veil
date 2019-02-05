package net.imageveil.app.servlets

import net.imageveil.app.utils.I18n
import net.imageveil.app.templates.PageTemplate
import net.imageveil.app.templates.mCheckbox
import net.imageveil.app.templates.mSelect
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import kotlinx.html.*
import kotlinx.html.dom.*
import java.util.*

@WebServlet(
        name = "ImageVeilApp",
        displayName = "ImageVeil WebApplication",
        description = "Provides an API to pixelate/blur images, remove exif data and change chip characteristics.",
        urlPatterns = [ "" ]
)
class Application : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val i18n = (request.getAttribute("i18n") ?: I18n(Locale.ENGLISH)) as I18n

        val dom = PageTemplate.site("App", request) {
            h1(classes = "m-headline") { +i18n.get("app.title") }
            div(classes = "m-settings") {
                a(classes = "m-settings--toggle", href = "#") {
                    i(classes = "fas fa-sliders-h m-settings--toggle--cogs")
                    i(classes = "fas fa-times m-settings--toggle--x")
                }

                mSelect(elementId = "mode", label = i18n.get("app.main.mode.caption")) {
                    option { value = "square"; +i18n.get("app.main.mode.options.square"); attributes["selected"] = "selected" }
                    option { value = "fill"; +i18n.get("app.main.mode.options.fill") }
                }
                mCheckbox(elementId = "addNoise", label = i18n.get("app.main.options.addNoise.label"), checked = true)
                mCheckbox(elementId = "resize", label = i18n.get("app.main.options.resize.label"), checked = true)
            }

            div(classes = "m-upload") {
                attributes["data-i18n--file-size-hint"] = i18n.get("js.fileSizeHint")
                attributes["data-i18n--file-type-hint"] = i18n.get("js.fileTypeHint")
                attributes["data-i18n--new-file-hint"] = i18n.get("js.newFileHint")

                p(classes = "m-upload--text") { +i18n.get("app.main.upload.startHint") }
                form(encType = FormEncType.multipartFormData) {
                    id = "uploadform"
                    fileInput(name = "image") { id = "imageFile"; accept = "image/jpeg" }
                    hiddenInput(name = "options") { id = "imageOptions" }
                }
            }

            div(classes = "m-preview-container") {
                i(classes = "m-preview-container--touch-help fas fa-hand-point-up")
                div(classes = "m-preview") {
                    div(classes = "m-preview--areas")
                    img(classes = "m-preview--image", src = "", alt = i18n.get("app.main.preview.image.alt"))
                }
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