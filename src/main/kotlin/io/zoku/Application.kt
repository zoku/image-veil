package io.zoku

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
        val dom = createHTMLDocument().html {
            head {
                title { +"AnonImage App" }
                meta(name = "desciption", content = "Anonymise you images with ease.")

                styleLink(url = "/assets/styles/styles.css")
            }

            body {
                h1 { +"AnonImage App" }
                div(classes = "m-upload") {
                    p(classes = "m-upload--text") { +"Click or drop file here to start" }
                    form(encType = FormEncType.multipartFormData) { id = "uploadform"
                        fileInput(name = "image") { id = "imageFile" }
                        hiddenInput(name = "areas") { id = "areasInput" }
                        hiddenInput(name = "imageData") { id = "imageDataInput" }
                    }
                }

                div(classes = "m-preview") {
                    div(classes = "m-preview--shadow")
                    div(classes = "m-preview--areas")
                    img(classes = "m-preview--image") { src = "/assets/img/preview.png"; alt = "Preview Image" }
                }

                a(href = "#", target = "_blank") { id = "downloadLink"; img(src = "/assets/img/preview.png", alt = "Download image") }

                div(classes = "m-progress") { id = "progress"
                    div(classes = "m-progress--bar") {  }
                }

                input(type = InputType.button) { id = "startButton"; value = "Anonymise!" }

                script(type = "text/javascript", src = "/assets/js/lib/jquery-3.3.1.min.js") {}
                script(type = "text/javascript", src = "/assets/js/application.js") {}
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        request.getPart("image").inputStream

        doGet(request = request, response = response)
    }
}