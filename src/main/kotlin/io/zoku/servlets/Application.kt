package io.zoku.servlets

import io.zoku.elements.HTML
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import kotlinx.html.*
import kotlinx.html.dom.*

@WebServlet(
        name = "AnonImageApp",
        displayName = "AnonImage WebApplication",
        description = "Provides an API to pixelate/blur images, remove exif data and change chip characteristics.",
        urlPatterns = [ "" ]
)
class Application : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val dom = HTML.site("App") {
            div(classes = "m-upload") {
                p(classes = "m-upload--text") { +"Click or drop file here to start" }
                form(encType = FormEncType.multipartFormData) {
                    id = "uploadform"
                    fileInput(name = "image") { id = "imageFile" }
                    hiddenInput(name = "areas") { id = "areasInput" }
                    hiddenInput(name = "imageData") { id = "imageDataInput" }
                    hiddenInput(name = "mode") { id = "modeInput" }
                }
            }

            div(classes = "m-preview") {
                div(classes = "m-preview--shadow")
                div(classes = "m-preview--areas")
                img(classes = "m-preview--image", src = "/assets/img/preview.png", alt = "Preview Image")
            }

            div(classes = "m-mode") {
                label { htmlFor = "mode"; +"Type of pixelisation" }
                select {
                    id = "mode"
                    option { value = "square"; +"Square mosaic"; attributes["selected"] = "" }
                    option { value = "black"; +"Black blocks" }
                    option { value = "none"; +"No pixelisation"; }
                }
            }

            div(classes = "m-progress") {
                id = "progress"
                div(classes = "m-progress--bar") { }
            }

            input(type = InputType.button) { id = "startButton"; value = "Anonymise!" }

            div(classes = "m-download") {
                a( classes = "m-download--close", href = "#") { +"X" }
                div(classes = "m-download--content") {
                    h2 { +"Done!" }
                    p { +"You can download this image by right clicking it and selecting 'Save image as...'." }
                    img(src = "/assets/img/preview.png", alt = "Download image")
                }
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        request.getPart("image").inputStream

        doGet(request = request, response = response)
    }
}