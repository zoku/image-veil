package io.zoku.servlets

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import io.zoku.elements.HTML
import kotlinx.html.dom.serialize
import kotlinx.html.unsafe
import java.io.File
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet(
        name = "Pages",
        description = "Shows pages",
        urlPatterns = [ "/pages/*" ]
)
class Pages : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val pageName = request.requestURI.split("/").last()

        val title: String
        val mdFile: String

        when (pageName) {
            "imprint" -> { title = "Imprint"; mdFile = "imprint.md" }
            "privacy" -> { title = "Privacy policy"; mdFile = "privacy.md" }
            "faq" -> { title = "How to use (FAQ)"; mdFile = "faq.md" }
            else -> { title = "Error 404"; mdFile = "error404.md" }
        }

        val resource = File(Pages::class.java.getResource("/pages/$mdFile").file)

        val parser = Parser.builder().build()
        val renderer = HtmlRenderer.builder().build()

        val document = parser.parse(resource.readText())
        val html = renderer.render(document)

        val dom = HTML.site(title) {
            unsafe { +"""<div class="m-page-content">$html</div>""" }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}