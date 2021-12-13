package net.imageveil.app.servlets

import com.google.gson.GsonBuilder
import kotlinx.html.*
import kotlinx.html.dom.serialize
import net.imageveil.app.templates.PageTemplate
import org.slf4j.LoggerFactory
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
    private val logger = LoggerFactory.getLogger("Statistics")

    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {

        val mode = request.getParameter("m") ?: "d"

        val statsFilePath = servletContext.getRealPath(File.separator) + "../imageveil-uses.csv"
        val dates = try {
            val logFile = File(statsFilePath)
            val textDates = logFile.readLines()
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS")

            textDates.map {
                LocalDateTime.from(formatter.parse(it))
            }
        } catch (e: Exception) {
            logger.error("Stats file '$statsFilePath' could not be read.")
            arrayListOf<LocalDateTime>()
        }

        val firstDate = when(mode) {
            "d" -> LocalDateTime.now().minusMonths(1)
            "m" -> LocalDateTime.now().minusMonths(12)
            "y" -> LocalDateTime.now().minusYears(5)
            else -> dates.minOrNull() ?: LocalDateTime.now()
        }

        val dataDates = arrayListOf<String>()
        val dataNumbers = arrayListOf<Int>()

        if (mode == "d") {
            for (day in 0 until DAYS.between(firstDate, LocalDateTime.now().plusDays(1))) {
                val currentDate = firstDate.plusDays(day)

                val events = dates.filter {
                    it.year == currentDate.year && it.month == currentDate.month && it.dayOfMonth == currentDate.dayOfMonth
                }.size

                dataDates.add("${currentDate.year}-${currentDate.month.value}-${currentDate.dayOfMonth}")
                dataNumbers.add(events)
            }
        }

        if (mode == "m") {
            for (month in 0 until MONTHS.between(firstDate, LocalDateTime.now().plusMonths(1))) {
                val currentDate = firstDate.plusMonths(month)

                val events = dates.filter {
                    it.year == currentDate.year && it.month == currentDate.month
                }.size

                dataDates.add("${currentDate.month} ${currentDate.year}")
                dataNumbers.add(events)
            }
        }

        if (mode == "y") {
            for (year in 0 until YEARS.between(firstDate, LocalDateTime.now().plusYears(1))) {
                val currentDate = firstDate.plusYears(year)

                val events = dates.filter {
                    it.year == currentDate.year
                }.size

                dataDates.add("${currentDate.year}")
                dataNumbers.add(events)
            }
        }

        val dom = PageTemplate.site(title = "Statistics", request = request) {
            div(classes = "m-page-content") {
                h1 { +"Statistics" }

                div(classes = "m-statistics--switches") {
                    div(classes = "m-statistics--switches--switch") { a(href = "?m=d") { +"Days" } }
                    div(classes = "m-statistics--switches--switch") { a(href = "?m=m") { +"Months" } }
                    div(classes = "m-statistics--switches--switch") { a(href = "?m=y") { +"Years" } }
                }

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