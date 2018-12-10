package io.zoku.anonimage.servlets

import com.google.gson.GsonBuilder
import io.zoku.anonimage.model.Areas
import io.zoku.anonimage.model.ImageData
import io.zoku.anonimage.transformers.*
import org.slf4j.LoggerFactory
import java.awt.Color
import java.awt.Graphics2D
import javax.imageio.ImageIO
import javax.servlet.annotation.MultipartConfig
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import kotlin.math.roundToInt
import javax.xml.bind.DatatypeConverter
import java.io.ByteArrayOutputStream
import java.io.File
import java.lang.Exception
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


@WebServlet(
        name = "ImageReceiver",
        displayName = "Image Receiver",
        description = "Receives an image from the app and prepares it for usage.",
        urlPatterns = [ "/imagereceiver" ]
)
@MultipartConfig
class ImageReceiver : HttpServlet() {
    private val logger = LoggerFactory.getLogger("ImageReceiver")
    private val gson = GsonBuilder().setPrettyPrinting().create()

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        val areas = gson.fromJson(request.getParameter("areas")?:"", Areas::class.java)
        val imageData = gson.fromJson(request.getParameter("imageData")?:"", ImageData::class.java)
        val mode = request.getParameter("mode")
        val imagePart = request.getPart("image")
        var image = ImageIO.read(imagePart.inputStream)

        val scaleX = image.width / imageData.width
        val scaleY = image.height / imageData.height

        val transformers = arrayListOf<Transformer>()

        transformers.add(Randomiser())

        when (mode) {
            "black" -> transformers.add(Blackout(areas, scaleX, scaleY))
            "square" -> transformers.add(Pixeliser(areas, scaleX, scaleY))
        }

        if (image.width > 1280 || image.height > 1280) {
            transformers.add(Shrinker())
        }

        transformers.forEach { transformer ->
            image = transformer.run(image)
        }

        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        try {
            val logFile = File("${System.getProperty("user.home")}/anonimage-uses.log")
            logFile.appendText(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS").format(LocalDateTime.now()) + "\n")
        } catch (e: Exception) {
            logger.error("Log file could not be written.")
        }

        response.writer.append(imageString)
    }
}