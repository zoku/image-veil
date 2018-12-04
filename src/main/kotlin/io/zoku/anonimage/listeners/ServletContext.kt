package io.zoku.anonimage.listeners

import javax.servlet.ServletContextEvent
import javax.servlet.ServletContextListener
import javax.servlet.annotation.WebListener

@WebListener()
class ServletContext : ServletContextListener {
    override fun contextInitialized(contextEvent: ServletContextEvent) {

    }

    override fun contextDestroyed(contextEvent: ServletContextEvent) {
    }
}