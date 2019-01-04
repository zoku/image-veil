package net.imageveil.app.utils

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

        // Configure Mail Client
        val properties = Properties()
        properties["mail.smtp.host"] = CONFIG.getProperty("mail.smtp.host")
        properties["mail.smtp.port"] = CONFIG.getProperty("mail.smtp.port")
        properties["mail.smtp.socketFactory.port"] = CONFIG.getProperty("mail.smtp.port")
        properties["mail.smtp.starttls.enable"] = CONFIG.getProperty("mail.smtp.starttls.enable")
        properties["mail.smtp.auth"] = CONFIG.getProperty("mail.smtp.auth")
        properties["mail.smtp.socketFactory.class"] = "javax.net.ssl.SSLSocketFactory"
        properties["mail.smtp.socketFactory.fallback"] = "false"
        properties["mail.store.protocol"] = "pop3"
        properties["mail.transport.protocol"] = "smtp"
        properties["mail.pop3.socketFactory.fallback"] = "false"

        // properties["mail.debug"] = "true"
        // properties["mail.debug.auth"] = "true"

        // Get auth-session
        val session = Session.getInstance(properties, object : Authenticator() {
            override fun getPasswordAuthentication(): PasswordAuthentication  {
                return PasswordAuthentication(username, password)
            }
        })

        // Prepare message and send it
        val message = MimeMessage(session)
        message.setFrom(InternetAddress(CONFIG.getProperty("mail.smtp.envelopAddress")))
        message.setRecipients(MimeMessage.RecipientType.TO, InternetAddress.parse(CONFIG.getProperty("mail.smtp.recipientAddress")))
        message.replyTo = arrayOf(InternetAddress(senderMail))
        message.subject = subject
        message.setText(messageText)

        Transport.send(message)
    }
}