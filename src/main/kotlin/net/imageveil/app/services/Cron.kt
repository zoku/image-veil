package net.imageveil.app.services

import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import javax.servlet.ServletContextEvent
import javax.servlet.ServletContextListener
import javax.servlet.annotation.WebListener

@WebListener
class Cron : ServletContextListener {
    // private val log = LoggerFactory.getLogger("Cron")
    lateinit var scheduler: ScheduledExecutorService

    override fun contextInitialized(sce: ServletContextEvent) {
        scheduler = Executors.newSingleThreadScheduledExecutor()

        // Delete expired images
//        scheduler.scheduleAtFixedRate({
//            var removedImages = 0
//            ImagePool.forEach {
//                if (it.value.expires.isBefore(LocalDateTime.now())) {
//                    ImagePool.remove(it.key)
//                    removedImages++
//                }
//            }
//            log.info("$removedImages removed from ImagePool")
//        }, 30, 30, TimeUnit.MINUTES)
    }

    override fun contextDestroyed(sce: ServletContextEvent) {
        scheduler.shutdown()
    }

}