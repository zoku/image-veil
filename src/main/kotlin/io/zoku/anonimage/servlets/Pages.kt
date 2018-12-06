package io.zoku.anonimage.servlets

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import io.zoku.anonimage.I18n
import io.zoku.anonimage.elements.HTML
import kotlinx.html.dom.serialize
import kotlinx.html.unsafe
import java.io.File
import java.util.*
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
        val lang = request.getParameter("l") ?: request.locale.language
        val i18n = I18n(Locale(lang))
        val pageName = request.requestURI.split("/").last()

        val title: String
        val mdFile: String

        when (pageName) {
            i18n.get("app.pages.imprint.uri") -> { title = i18n.get("app.pages.imprint.title"); mdFile = "imprint.md" }
            i18n.get("app.pages.privacy.uri") -> { title = i18n.get("app.pages.privacy.title"); mdFile = "privacy.md" }
            i18n.get("app.pages.howto.uri") -> { title = i18n.get("app.pages.howto.title"); mdFile = "howto.md" }
            i18n.get("app.pages.faq.uri") -> { title = i18n.get("app.pages.faq.title"); mdFile = "faq.md" }
            else -> { title = i18n.get("app.pages.error404.title"); mdFile = "error404.md" }
        }

        val resource = File(Pages::class.java.getResource("/pages/$lang/$mdFile").file)

        val parser = Parser.builder().build()
        val renderer = HtmlRenderer.builder().build()

        val document = parser.parse(resource.readText())
        val html = renderer.render(document)

        val dom = HTML.site(title, request) {
            unsafe { +"""<div class="m-page-content">$html</div>""" }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}