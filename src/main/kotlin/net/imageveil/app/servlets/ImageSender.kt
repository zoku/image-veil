package net.imageveil.app.servlets

import net.imageveil.app.utils.Crypt
import net.imageveil.app.utils.ImagePool
import java.lang.Exception
import java.time.LocalDateTime
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.xml.bind.DatatypeConverter

@WebServlet(
        name = "ImageSender",
        urlPatterns = [ "/imagesender" ]
)
@Deprecated("DO NOT USE FOR SECURITY REASONS!!")
class ImageSender : HttpServlet() {
    override fun doGet(request: HttpServletRequest, response: HttpServletResponse) {
        val hash = request.getParameter("i")
        val mode = request.getParameter("m") ?: "d"
        val key = request.getParameter("k")

        if (hash == null) {
            response.sendError(403, "Hash is required to get image")
            return
        }

        if (key == null) {
            response.sendError(403, "Key is required to decrypt image")
            return
        }

        if (!ImagePool.containsKey(hash)) {
            response.sendError(404, "Image not found")
            return
        }

        if (ImagePool[hash]?.expires?.isBefore(LocalDateTime.now()) == true) {
            response.sendError(410, "Image is expired")
            return
        }

        if (ImagePool[hash]?.previewed == true && mode == "p") {
            response.sendError(410, "Preview already done")
            return
        }

        val image = try {
            Crypt.decrypt(ImagePool[hash]!!.image, DatatypeConverter.parseHexBinary(key))
        } catch (e: Exception) {
            response.sendError(403, "Could not decrypt image")
            return
        }


        when (mode) {
            "d" -> ImagePool.remove(hash)
            "p" -> ImagePool[hash]?.previewed = true
        }

        response.contentType = "image/jpeg"
        response.setContentLength(image.size)
        response.setHeader("Content-Disposition", "attachment; filename=\"anonymous-image.jpg\"")
        response.outputStream.write(image)
    }
}