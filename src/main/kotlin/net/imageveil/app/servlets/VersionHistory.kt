package net.imageveil.app.servlets

import com.google.gson.GsonBuilder
import kotlinx.html.*
import kotlinx.html.dom.serialize
import net.imageveil.app.model.VersionDescription
import net.imageveil.app.templates.PageTemplate
import org.slf4j.LoggerFactory
import java.io.File
import java.text.SimpleDateFormat
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Created by Manuel Helbing on 2019-01-01.
 */
@WebServlet(
        name = "VersionHistory",
        urlPatterns = [ "/version-history" ]
)
class VersionHistory : HttpServlet() {
    private val logger = LoggerFactory.getLogger("VersionHistory")
    private val gson = GsonBuilder().create()
    private val sdf = SimpleDateFormat("yyyy/MM/dd")

    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {

        val dom = PageTemplate.site(title = "Version History", request = request) {
            div(classes = "m-page-content") {
                h1 { +"Version History" }

                ol(classes = "m-versions") {

                    val versions = File(VersionHistory::class.java.getResource("/versions").toURI()).listFiles().filter { it.name.endsWith(".json") }.reversed()

                    versions.forEachIndexed { index, version ->
                        val jVersion = gson.fromJson(version.readText(), VersionDescription::class.java) ?: return@forEachIndexed

                        li(classes = "m-versions--version") {
                            div(classes = "m-versions--version--title") {
                                +"Version ${jVersion.id}, released on ${sdf.format(jVersion.releaseDate)}"
                                +if (index == 0) " (current)" else ""
                            }

                            div(classes = "m-versions--version--details${if (index == 0) " m-versions--version--details_show" else ""}") {
                                div(classes = "m-versions--version--details--simple") {
                                    +jVersion.simple; br; br
                                    a(href = "#", classes = "m-versions--version--details--simple--switch") { +"Toggle details" }
                                }

                                div(classes = "m-versions--version--details--all") {
                                    p(classes = "m-versions--version--details--all--section-head") { strong { +"Fixes" } }
                                    jVersion.details.fix.forEach { fix ->
                                        p(classes = "m-versions--version--details--all--section-item") { +fix }
                                    }

                                    p(classes = "m-versions--version--details--all--section-head") { strong { +"Features" } }
                                    jVersion.details.feat.forEach { feat ->
                                        p(classes = "m-versions--version--details--all--section-item") { +feat }
                                    }

                                    p(classes = "m-versions--version--details--all--section-head") { strong { +"Chores" } }
                                    jVersion.details.chore.forEach { chore ->
                                        p(classes = "m-versions--version--details--all--section-item") { +chore }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}