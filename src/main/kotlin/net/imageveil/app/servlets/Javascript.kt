package net.imageveil.app.servlets

import java.io.File
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Created by Manuel Helbing on 2018-12-22.
 */
@WebServlet(
        name = "Javascript",
        urlPatterns = [ "/assets/js/application.pack.js" ]
)
class Javascript : HttpServlet() {
    private val scripts = arrayOf(
            "lib/jquery-3.3.1.min.js",
            "lib/jquery-ui.min.js",
            "lib/jquery-ui.touch-punch.min.js",
            "lib/chart.bundle.min.js",
            "application.min.js",
            "contact.min.js",
            "language.min.js",
            "statistics.min.js",
            "version-history.js"
    )

    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val packagedScripts = StringBuilder()

        scripts.forEach {script ->
            val scriptFile = Javascript::class.java.getResource("/javascript/$script").toURI()
            packagedScripts.append(File(scriptFile).readText())
        }

        response.contentType = "text/javascript"
        response.writer.append(packagedScripts)
    }
}