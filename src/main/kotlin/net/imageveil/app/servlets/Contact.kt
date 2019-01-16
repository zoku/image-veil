package net.imageveil.app.servlets

import kotlinx.html.*
import kotlinx.html.dom.serialize
import net.imageveil.app.templates.PageTemplate
import net.imageveil.app.templates.mButton
import net.imageveil.app.templates.mTextArea
import net.imageveil.app.templates.mTextBox
import net.imageveil.app.utils.I18n
import net.imageveil.app.utils.Mailer
import org.slf4j.LoggerFactory
import java.lang.Exception
import java.time.LocalDateTime
import java.util.*
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

/**
 * Created by Manuel Helbing on 2018-12-21.
 */
@WebServlet(
        name = "Contact",
        urlPatterns = [ "/contact" ]
)
class Contact : HttpServlet() {
    private val logger = LoggerFactory.getLogger("Contact")
    private val tokens = hashMapOf<String, LocalDateTime>()

    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val i18n = (request.getAttribute("i18n") ?: I18n(Locale.ENGLISH)) as I18n

        val currentToken = UUID.randomUUID().toString()
        tokens[currentToken] = LocalDateTime.now().plusMinutes(30)

        val dom = PageTemplate.site(i18n.get("app.contact.headline"), request) {
            div(classes = "m-page-content") {
                h1 { +i18n.get("app.contact.headline") }

                p { +i18n.get("app.contact.text") }

                div(classes = "m-contact--form") {
                    mTextBox(elementId = "mailAddress", label = i18n.get("app.contact.email"))
                    mTextBox(elementId = "subject", label = i18n.get("app.contact.subject"))
                    mTextArea(elementId = "message", label = i18n.get("app.contact.message"))
                    hiddenInput { id = "token"; value = currentToken }
                    hiddenInput { id = "language"; value = i18n.lang }
                    mButton(elementId = "send", label = i18n.get("app.contact.send"))
                }

                div(classes = "m-contact--finish") {}
            }
        }

        response.writer.append(dom.serialize(prettyPrint = true))
    }

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        val i18n = request.getAttribute("i18n") as I18n

        val email = request.getParameter("email")
        var subject = request.getParameter("subject")
        val message = request.getParameter("message")
        val token = request.getParameter("token")

        if (token != null && tokens.containsKey(token)) {
            tokens.remove(token)
        } else if (token != null && !tokens.containsKey(token)) {
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.token.invalid")}"}""")
            return
        } else {
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.token.invalid")}"}""")
            return
        }

        if (email.isNullOrBlank()) {
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.email.empty")}"}""")
            return
        }

        if (!email.matches(".+@.+\\..+".toRegex())) {
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.email.invalid")}"}""")
            return
        }

        if (subject.isNullOrBlank()) {
            subject = "No subject (${i18n.lang})"
        } else {
            subject += " (${i18n.lang})"
        }

        if (message.isNullOrBlank()) {
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.message.empty")}"}""")
            return
        }

        try {
            Mailer.sendMessage(
                    senderMail = email,
                    subject = subject,
                    messageText = message
            )
        } catch (e: Exception) {
            e.printStackTrace()
            response.writer.append("""{"success":false,"message":"${i18n.get("app.contact.error.unknown")}"}""")
            return
        }

        response.contentType = "application/json"

        response.writer.append("""{"success":true,"message":"${i18n.get("app.contact.success.sent")}"}""")
    }
}