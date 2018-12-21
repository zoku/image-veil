package net.imageveil.app.servlets

import net.imageveil.app.utils.I18n
import net.imageveil.app.templates.PageTemplate
import kotlinx.html.div
import kotlinx.html.dom.serialize
import kotlinx.html.h1
import kotlinx.html.h2
import kotlinx.html.p
import org.slf4j.LoggerFactory
import java.util.*
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet(
        name = "ErrorPage",
        description = "Handles errors and displays an error message.",
        urlPatterns = [ "/error" ]
)
class Error : HttpServlet() {
    private val logger = LoggerFactory.getLogger("ErrorServlet")
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val throwable = request.getAttribute("javax.servlet.error.exception") as Throwable?
        val statusCode = request.getAttribute("javax.servlet.error.status_code") as Int?
        val servletName = request.getAttribute("javax.servlet.error.servlet_name") as String?

        val i18n = request.getAttribute("i18n") as I18n

        val dom = PageTemplate.site(i18n.get("error.headline"), request) {
            h1(classes = "m-headline") { +i18n.get("error.headline") }
            div(classes = "m-page-content") {
                h2 { +"${i18n.get("error.headline")} $statusCode" }
                p { +i18n.get("error.description.$statusCode") }
            }
        }

        logger.error("$servletName threw: $statusCode because of '${throwable?.message}'")

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}