package net.imageveil.app.servlets

import com.google.gson.GsonBuilder
import kotlinx.html.*
import kotlinx.html.dom.serialize
import net.imageveil.app.templates.PageTemplate
import java.io.File
import java.lang.Exception
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import java.time.temporal.ChronoUnit.*

/**
 * Created by Manuel Helbing on 2019-01-01.
 */
@WebServlet(
        name = "Statistics",
        urlPatterns = [ "/statistics" ]
)
class Statistics : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {

        val dates = try {
            val logFile = File("${System.getProperty("user.home")}/imageveil-uses.log")
            val textDates = logFile.readLines()
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS")

            textDates.map {
                LocalDateTime.from(formatter.parse(it))
            }
        } catch (e: Exception) {
            arrayListOf<LocalDateTime>()
        }

        val firstDate = dates.min() ?: LocalDateTime.now()
        // val lastDate = dates.max() ?: LocalDateTime.now()

        val dataDates = arrayListOf<String>()
        val dataNumbers = arrayListOf<Int>()

        for (day in 0 until DAYS.between(firstDate, LocalDateTime.now().plusDays(1))) {
            val currentDate = firstDate.plusDays(day)

            val events = dates.filter {
                it.year == currentDate.year &&
                it.month == currentDate.month &&
                it.dayOfMonth == currentDate.dayOfMonth
            }.size

            dataDates.add("${currentDate.year}-${currentDate.month.value}-${currentDate.dayOfMonth}")
            dataNumbers.add(events)
        }

        val dom = PageTemplate.site(title = "Statistics", request = request) {
            div(classes = "m-page-content") {
                h1 { +"Statistics" }

                canvas { id = "m-statistics" }

                script {
                    unsafe {
                        +"""
                            var dates = ${GsonBuilder().create().toJson(dataDates)};
                            var numbers = ${GsonBuilder().create().toJson(dataNumbers)};
                        """.trimIndent()
                    }
                }
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }
}