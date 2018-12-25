package net.imageveil.app.utils

import java.io.IOException
import java.util.*
import javax.mail.*
import javax.mail.internet.*

/**
 * Created by Manuel Helbing on 2018-12-23.
 */
object Mailer {
    private val CONFIG = Properties()

    init {
        CONFIG.load(javaClass.getResourceAsStream("/mailer.properties"))
    }

    fun sendMessage(senderMail: String, subject: String, messageText: String) {
        val username = CONFIG.getProperty("mail.smtp.username")
        val password = CONFIG.getProperty("mail.smtp.password")

        // Prepare message
        val body = StringBuilder()
        body.append(messageText)

        try {
            // Configure Mail Client
            val props = Properties()
            props["mail.smtp.auth"] = CONFIG.getProperty("mail.smtp.auth")
            props["mail.smtp.starttls.enable"] = CONFIG.getProperty("mail.smtp.starttls.enable")
            props["mail.smtp.host"] = CONFIG.getProperty("mail.smtp.host")
            props["mail.smtp.port"] = CONFIG.getProperty("mail.smtp.port")

            val session = Session.getInstance(props, object : Authenticator() {
                override fun getPasswordAuthentication(): PasswordAuthentication  {
                    return PasswordAuthentication(username, password)
                }
            })

            // Configure Mail Message
            val message = MimeMessage(session)

            // Set from- and reply-to
            message.setFrom(InternetAddress(CONFIG.getProperty("mail.smtp.envelopAddress")))
            message.replyTo = arrayOf(InternetAddress(senderMail) )

            // Set recipient information
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(CONFIG.getProperty("mail.smtp.recipientAddress")))

            // Set Mail parameters
            message.subject = subject
            message.setContent(body, "text/plain; charset=utf-8")

            // Send Mail Message
            Transport.send(message)

        } catch (e: Exception) {
            when(e) {
                is IOException, is MessagingException -> e.printStackTrace()
                else -> throw e
            }
        }
    }
}