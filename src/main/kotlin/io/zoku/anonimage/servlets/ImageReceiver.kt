package io.zoku.anonimage.servlets

import com.google.gson.GsonBuilder
import io.zoku.anonimage.model.Areas
import io.zoku.anonimage.model.ImageData
import io.zoku.anonimage.transformers.*
import org.slf4j.LoggerFactory
import javax.imageio.ImageIO
import javax.servlet.annotation.MultipartConfig
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.xml.bind.DatatypeConverter
import java.io.ByteArrayOutputStream
import java.io.File
import java.lang.Exception
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*


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
        // Load config
        val config = Properties()
        config.load(ImageReceiver::class.java.getResourceAsStream("/config.properties"))

        // Define variables
        val areas = gson.fromJson(request.getParameter("areas")?:"", Areas::class.java)
        val imageData = gson.fromJson(request.getParameter("imageData")?:"", ImageData::class.java)
        val mode = request.getParameter("mode")
        val imagePart = request.getPart("image")
        var image = ImageIO.read(imagePart.inputStream)

        val scaleX = image.width / imageData.width
        val scaleY = image.height / imageData.height

        val transformers = arrayListOf<Transformer>()

        // Add transformers
        if (config["imageReceiver.addNoise"] == "true") {
            transformers.add(Randomiser())
        }

        when (mode) {
            "black" -> transformers.add(Blackout(areas, scaleX, scaleY))
            "square" -> transformers.add(Pixeliser(areas, scaleX, scaleY))
        }

        if (image.width > config["imageReceiver.maxImageEdgeSize"].toString().toInt() || image.height > config["imageReceiver.maxImageEdgeSize"].toString().toInt()) {
            transformers.add(Shrinker(config["imageReceiver.maxImageEdgeSize"].toString().toDouble()))
        }

        // Run transformers
        transformers.forEach { transformer ->
            image = transformer.run(image)
        }

        // Prepare image as image-uri
        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        // Log process
        try {
            val logFile = File("${System.getProperty("user.home")}/anonimage-uses.log")
            logFile.appendText(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS").format(LocalDateTime.now()) + "\n")
        } catch (e: Exception) {
            logger.error("Log file could not be written.")
        }

        // Output image
        response.writer.append(imageString)
    }
}