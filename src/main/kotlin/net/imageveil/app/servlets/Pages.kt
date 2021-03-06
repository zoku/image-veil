package net.imageveil.app.servlets

import com.vladsch.flexmark.ext.gfm.strikethrough.StrikethroughExtension
import com.vladsch.flexmark.ext.media.tags.MediaTagsExtension
import com.vladsch.flexmark.ext.tables.TablesExtension
import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser
import com.vladsch.flexmark.util.options.MutableDataSet
import net.imageveil.app.utils.I18n
import net.imageveil.app.templates.PageTemplate
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
        val i18n = (request.getAttribute("i18n") ?: I18n(Locale.ENGLISH)) as I18n
        val pageName = request.requestURI.split("/").last()

        val title: String
        val mdFile: String
        val pageId: String

        when (pageName) {
            i18n.get("app.pages.about.uri") -> { title = i18n.get("app.pages.about.title"); mdFile = "about.md"; pageId = "about" }
            i18n.get("app.pages.imprint.uri") -> { title = i18n.get("app.pages.imprint.title"); mdFile = "imprint.md"; pageId = "imprint" }
            i18n.get("app.pages.privacy.uri") -> { title = i18n.get("app.pages.privacy.title"); mdFile = "privacy.md"; pageId = "privacy" }
            i18n.get("app.pages.howto.uri") -> { title = i18n.get("app.pages.howto.title"); mdFile = "howto.md"; pageId = "howto" }
            i18n.get("app.pages.faq.uri") -> { title = i18n.get("app.pages.faq.title"); mdFile = "faq.md"; pageId = "faq" }
            i18n.get("app.pages.imageAnalysis.uri") -> { title = i18n.get("app.pages.imageAnalysis.title"); mdFile = "image-analysis.md"; pageId = "imageAnalysis" }
            else -> { response.sendError(404); return }
        }

        val resource = try {
            File(Pages::class.java.getResource("/pages/${i18n.lang}/$mdFile").toURI())
        } catch (e: Exception) {
            response.sendError(404)
            return
        }

        val options = MutableDataSet()
        options.set(Parser.EXTENSIONS, Arrays.asList(
                TablesExtension.create(),
                StrikethroughExtension.create(),
                MediaTagsExtension.create()
        ))
        options.set(HtmlRenderer.SOFT_BREAK, "<br/>\n")

        val parser = Parser.builder(options).build()
        val renderer = HtmlRenderer.builder(options).build()

        val document = parser.parse(resource.readText())
        var html = renderer.render(document)

        if (request.getParameter("l") != null) {
            html = html.replace("""href="(?!https?://)(.+?)"""".toRegex(RegexOption.MULTILINE), """href="$1?l=${i18n.lang}"""")
        }

        val dom = PageTemplate.site(title, request, pageId) {
            unsafe { +"""<div class="m-page-content">$html</div>""" }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}